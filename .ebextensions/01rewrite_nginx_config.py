#! /usr/bin/python
"""Modifies nginx configuration file on AWS Elastic Beanstalk to support
WebSocket connections."""

__author__ = "Will Wade <will@e-wade.net>"
__version__ = "0.0.2"

import os


NGINX_CONF_FILE = '/etc/nginx/sites-enabled/00_elastic_beanstalk_proxy.conf'
NGINX_CONFIG = """
  location ~ /resize/([\d-]+)x([\d-]+)/(.*)/(.*) {
     proxy_pass                  http://$server_addr/assets/images/uploads/products/$3/$4;
     proxy_store on;
     proxy_store_access group:r all:r;
     proxy_store /sbuploads/proxy/store/$request_uri;
     proxy_temp_path /sbuploads/proxy/tmp/;
     add_header X-Nginx-Image Resized;
     image_filter                resize $1 $2;
     image_filter_jpeg_quality   80;
     image_filter_buffer         10M;
     error_page 415 = @empty;
  }

  location = @empty {
        access_log off;
        empty_gif;
  }
"""


def file_contains_string(trigger='location ~ /resize/'):
    with open(NGINX_CONF_FILE, 'r') as f:
        for line in f:
            if trigger in line:
                return True

    return False


def add_string_after_block(block='location /', string=NGINX_CONFIG):
    f = open(NGINX_CONF_FILE, 'r').readlines()
    new_f = []

    inside_block = False
    for line in f:
        new_f.append(line)

        if block in line:
            inside_block = True
        if inside_block and '}' in line:
            new_f += [l+'\n' for l in string.split('\n')]
            inside_block = False

    print new_f

    # overwrite config file
    f = open(NGINX_CONF_FILE, 'w')
    for line in new_f:
        f.write(line)
    f.close()


def restart_nginx():
    os.system("service nginx restart")


def main():
    print '--- NginX conf file exists ---'
    print NGINX_CONF_FILE
    isfile = os.path.isfile(NGINX_CONF_FILE)
    print isfile
    if not isfile:
        print 'abort'
        return

    print '--- Checking NginX configuration ---'
    already_fixed = file_contains_string()
    print already_fixed
    if already_fixed:
        print 'abort'
        return

    print '--- Changing NginX configuration ---'
    add_string_after_block()

    print '--- Restart NginX ---'
    restart_nginx()


if __name__ == "__main__":
    main()