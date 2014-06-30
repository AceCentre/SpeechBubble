from flask import render_template
from flask.ext.security import login_required, roles_required

from app import app, db
from auth import User


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/admin/users')
@login_required
def list_users():
    return render_template('list_users.html', users=User.objects)


@app.route('/user/edit')
def edit_user():
    return render_template('list_users.html')


@roles_required(['Admin', 'Moderator'])
@app.route('/moderation')
def moderation_queue():
    return render_template('moderation.html')


@app.route('/catalog')
def show_item():
    return render_template('display-item.html')


@app.route('/test-hardware')
@login_required
def test_hardware():
    return render_template('test-hardware.html')