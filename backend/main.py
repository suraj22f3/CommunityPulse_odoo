from flask import Flask

from application import models
from application.config import DevelopmentConfig
from application.instances import cache
from application.extensions import security,db
from application import views

from application.worker import celery_init_app
import flask_excel as excel


def create_app():
    app=Flask(__name__)
    app.config.from_object(DevelopmentConfig)

    app.config['SECRET_KEY'] = "should-not-be-exposed"
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data.db"
    app.config['SECURITY_PASSWORD_SALT'] = 'salty-password'

    #configure token
    app.config['SECURITY_TOKEN_AUTHENTICATION_HEADER'] = 'Authentication-Token'
    app.config['SECURITY_TOKEN_MAX_AGE'] = 3600 #1hr 
    app.config['SECURITY_LOGIN_WITHOUT_CONFIRMATION'] = True

    db.init_app(app)
    excel.init_excel(app)
    cache.init_app(app)

    with app.app_context():

        from application.models import User, Role
        from flask_security import SQLAlchemyUserDatastore

        user_datastore = SQLAlchemyUserDatastore(models, User, Role)

        security.init_app(app, user_datastore)

        db.create_all()

        # create_data(user_datastore)
        # celery_app=None

    app.config['WTF_CSRF_CHECK_DEFAULT'] = False
    app.config['SECURITY_CSRF_PROTECH_MECHANISMS'] =[]
    app.config['SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS']=True

    views.create_view(app, user_datastore)
    # resources.api.init_app(app)

    return app

app=create_app()
celery_app = celery_init_app(app)

# @celery_app.on_after_configure.connect
# def send_email(sender,**kwargs):

#     #Daily Reminders to Users
#     sender.add_periodic_task(
#         crontab(hour=13, minute=18),
#         daily_reminder.s('yourLibrarian@email.com','Daily Reminder'),
#     )
#     #Monthly Activity Report
#     sender.add_periodic_task(
#         crontab(hour=13, minute=22, day_of_month=12),
#         monthly_activity.s('yourLibrarian@email.com','Monthly Report'),
#     )

    

if __name__=='__main__':
    app.run(debug=True)