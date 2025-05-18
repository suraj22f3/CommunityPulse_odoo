
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from flask_security.models import fsqla_v3 as fsq
from application.extensions import db,security
# db = SQLAlchemy()
fsq.FsModels.set_db_info(db)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(20), unique=True)
    phone = db.Column(db.String(15))
    password = db.Column(db.String(100))
    role = db.Column(db.String(10), default="user")
    organizer = db.Column(db.Boolean, default=False)
    banned = db.Column(db.Boolean, default=False)
    fs_uniquifier=db.Column(db.String(), nullable=False)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    location = db.Column(db.String(200))
    date = db.Column(db.DateTime)
    created_by = db.Column(db.Integer, db.ForeignKey("user.id"))
    approved = db.Column(db.Boolean, default=False)
    cancelled = db.Column(db.Boolean, default=False)

class Interest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"))
    even_name = db.Column(db.String(100), db.ForeignKey("event.title"))
    email = db.Column(db.String(200))
    phone = db.Column(db.String(15))

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80), unique = True, nullable = False)
    description = db.Column(db.String)