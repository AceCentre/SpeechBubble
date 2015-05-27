'use strict';

var _ = require('lodash');
var Product = require('../product/product.model');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

// Get list of imports
exports.importAppsForAAC = function(req, res) {
  var url = 'http://www.appsforaac.net/applist?items_per_page=All';
  request(url, function(err, response, body) {
    if(err) { handleError(res, err); }
    var productURLs = [];
    var $ = cheerio.load(body);
    $('td.views-field-title > a').each(function() {
      productURLs.push( $(this).attr('href') );
    });

    function importProduct(productPageURL) {
      request('http://www.appsforaac.net' + productPageURL, function(err, response, body) {
        if(err) { handleError(res, err); }
        var $ = cheerio.load(body);
        var name = $('#page-title').text().trim();
        if (name === 'Access denied') {
          console.log(productPageURL);
          return;
        }
        var description = $('.field-type-text-with-summary').first().text().trim() || 'No description';
        var price = {
          gbp: $('.field-name-field-price .field-item.even').text().trim().slice(1),
          aud: $('.field-name-field-priceaud .field-item.even').text().trim().slice(1),
          usd: $('.field-name-field-priceusd .field-item.even').text().trim().slice(1)
        };

        var supportLinks = [];

        $('.field-name-field-supporturl .field-items .field-item').each(function() {
          supportLinks.push({
            label: $(this).text().trim(),
            url: $(this).text().trim()
          });
        });

        var purchaseLinks = [];

        var $itunesLink = $('.field-name-field-itunesurl a').first();
        if($itunesLink.length) {
          purchaseLinks.push({
            label: 'iTunes',
            url: $itunesLink.attr('href')
          });
        }

        // Symbols
        var symbols = [];
        var imageRepresentation = {};

        $('.field-name-field-symbols-tax .field-items').text().split(',').forEach(function(symbol) {

          symbol = symbol.trim();
          switch(symbol) {
            case 'Photos':
              imageRepresentation.photos = true;
              break;
            case 'Video':
              imageRepresentation.videos = true;
              break;
            case 'None':
            case 'Unknown':
            case '':
              return;
            case 'Opensource':
              symbols.push('Other');
              break;
            default:
              symbols.push(symbol);
              break;
          }

        });

        var speechTypeOptions = {};
        var speechTypeSynthesisedTypes = [];

        $('.field-name-field-speech-tax .field-items a').each(function() {
          var speechType = $(this).text().trim();
          switch(speechType) {
            case 'Synthesised:Unknown':
              speechTypeOptions.synthesised = true;
              break;
            case 'Recorded':
              speechTypeOptions.recorded = true;
              break;
            case '':
              break;
            default:
              if(speechType.indexOf('Synthesised:') > -1 ) {
                speechTypeOptions.synthesised = true;
                speechTypeSynthesisedTypes.push(speechType.split(':')[1]);
              }
              break;
          }
        });

        var accessMethods = {};

        $('.field-name-field-accessops .field-items a').each(function() {
          var option = $(this).text().trim().toLowerCase();
          if(option.indexOf('touch') > -1) {
            accessMethods.touch = true;
          }
          if(option.indexOf('switch') > -1) {
            accessMethods.switch = true;
          }
          if(option.indexOf('mouse') > -1) {
            accessMethods.mouseOrAlternative = true;
          }
          if(option.indexOf('eyegaze') > -1) {
            accessMethods.mouseOrAlternative = true;
          }
        });

        var features = {
          price: price,
          supportLinks: supportLinks,
          purchaseLinks: purchaseLinks,
          symbols: symbols,
          imageRepresentation: imageRepresentation,
          speechTypeOptions: speechTypeOptions,
          speechTypeSynthesisedTypes: speechTypeSynthesisedTypes,
          accessMethods: accessMethods
        };

        Product.findOne({
          name: name
        }, function(err, product) {
          if(err) { handleError(res, err); }

          if(!product) {
            Product.create({
              type: 'ProductSoftware',
              name: name,
              description: description,
              features: features,
              author: req.user._id
            }, function(err, product) {
              if (err) { handleError(res, err); }

              var imagesToFetch = [];
              var images = [];

              $('.field-name-field-image img').each(function() {
                imagesToFetch.push( $(this).attr('src') );
              });

              var imagesLeft = imagesToFetch.length;
              var dir = process.env.UPLOAD_DIR + '/products/' + product._id;

              fs.mkdir(dir, function(err) {
                // Handle error unless directory exists
                if (err && err.code !== 'EEXIST') {
                  return handleError(res, err);
                }

                imagesToFetch.forEach(function(src) {
                  var filename = src.split('/').pop().split('?')[0];
                  var imageStream = fs.createWriteStream(dir + '/' + filename);

                  imageStream.on('close', function() {
                    images.push({
                      url: '/assets/images/uploads/products/' + product._id + '/' + filename,
                      summary: 'Software thumbnail'
                    });
                    --imagesLeft;
                    if(!imagesLeft) {
                      product.images = images;
                      product.save();
                    }
                  });

                  request
                    .get(src)
                    .pipe(imageStream);
                });
              });
              product.save(function(err) {
                if (err) { handleError(res, err); }
              });
            });
          } else {
            product.push({
              name: name,
              description: description,
              note: 'Apps for AAC Import',
              features: features,
              author: req.user._id
            });
            product.save();
          }
        });
      });
    }

    var interval = setInterval(function() {
      if(!productURLs.length) {
        return clearInterval(interval);
      }
      importProduct(productURLs.pop());
    }, 5000);
  });
};

function handleError(res, err) {

}
