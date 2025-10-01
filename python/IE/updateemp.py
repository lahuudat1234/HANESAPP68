import sys, json
import os
import mysql.connector
import string
import pandas as pd
from sqlalchemy import create_engine
#import random
import datetime
import numpy as np

mydb=mysql.connector.connect(
#    host='pbvweb01v',
    host='pbvweb01v',
    user='ngmai1',
    passwd='TomorrowNgoi',
    database="linebalancing"
)
pd.set_option("display.precision", 2)
engine_hbi_linebalancing = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
engine_hbi_pr2k = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/pr2k', echo=False)
engine_hbi_erpsystem = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/erpsystem', echo=False)
#hostname='127.0.0.1'
engine_local = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
testdate=datetime.datetime.today()
week=testdate.isocalendar()[1]+1
dlimit=testdate.strftime('%Y-%m-%d')
week=1
sql_emp=('delete from linebalancing.setup_emplist where week="'+str(week)+'";')
print(sql_emp)
myCursor=mydb.cursor()
myCursor.execute(sql_emp)
mydb.commit()
sql_emp=('insert into linebalancing.setup_emplist '
        +'(select ID,name,Line,shift,"'+str(week)+'" as week,Line as line_new,shift as shift_new,ML,"" AS ML_Leave,"" AS ML_Back,curdate() as dateupdate,"ie" as userupdate from erpsystem.setup_emplist where line!="");')
print(sql_emp)
myCursor=mydb.cursor()
myCursor.execute(sql_emp)
mydb.commit()