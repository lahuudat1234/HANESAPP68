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
#    host='localhost',
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
engine_local = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@localhost:3306/linebalancing', echo=False)
d_begin=datetime.date(2019,12,27)
testdate=datetime.datetime.today()
week=testdate.isocalendar()[1]
dlimit=testdate.strftime('%Y%m%d')

# '051-058', 'Woven Boxer-Exposed WB', 'RIT', 'Normal', ''
# group="347-353"
# shift="BALI"
# style_detail="U shape w/o piping-57% C: 38% Modal: 5% Spandex"
# size="Normal"
# ie_cbc=""
# week_cbc="37"
group=sys.argv[1]
shift=sys.argv[3]
style_detail=sys.argv[2]
size=sys.argv[4]
ie_cbc=sys.argv[5]
week_cbc=sys.argv[6]

ds=pd.read_sql('select * from employee_eff_data_ie_setup_temp where week="'+str(week_cbc)+'" and groupline="'+group+'" and shift="'+shift+'"and style_detail="'+style_detail+'" and size="'+size+'";',engine_hbi_linebalancing)
engine_hbi_linebalancing.dispose()
linksave=os.getcwd()
linksave.replace('\\','\\\\')
ds.to_excel(linksave+'\\python\\excelfile\\'+group+shift+week_cbc+'.xlsx')
print(group+shift+week_cbc+'.xlsx')