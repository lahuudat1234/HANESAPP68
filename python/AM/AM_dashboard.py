# -*- coding: utf-8 -*-
"""
Created on Thu Aug 18 08:30:07 2022

@author: ngmai1
"""

import sys, json
import os
import mysql.connector
import string
import pandas as pd
from sqlalchemy import create_engine
#import random
import datetime
import numpy as np
import math

mydb=mysql.connector.connect(
#    host='pbvweb01v',
    host='pbvweb01v',
    user='tranmung',
    passwd='Tr6nM6ng',
    database="mms"
)
myCursor=mydb.cursor()
pd.set_option("display.precision", 2)
engine_mms = create_engine('mysql+mysqlconnector://tranmung:Tr6nM6ng@pbvweb01v:3306/mms', echo=False)

company=pd.read_sql('select company,location_name from mms.am_inventory group by company;',engine_mms)

testdate=datetime.datetime.today()
week=testdate.isocalendar()[1]
year=testdate.isocalendar()[0]
month=testdate.strftime('%m')
week='30'
c=0
while c<len(company):
    com=str(company.iloc[c,0])
    com_name=str(company.iloc[c,1])
    active=pd.read_sql('select count(tag_number) from mms.am_inventory where company="'+str(com)+'" and (location="production" OR location="SMED");',engine_mms)
    act_mc=active.iloc[0,0]
    in_active=pd.read_sql('select count(tag_number) from mms.am_inventory where company="'+str(com)+'" and (location="WH" OR location="not plan 1");',engine_mms)
    ina_mc=in_active.iloc[0,0]
    disposal=pd.read_sql('select count(tag_number) from mms.am_inventory where company="'+str(com)+'" and status="disposal";',engine_mms)
    dis_mc=disposal.iloc[0,0]
    good=pd.read_sql('select count(tag_number) from mms.am_inventory where company="'+str(com)+'" and status="good";',engine_mms)
    goo_mc=good.iloc[0,0]
    poor=pd.read_sql('select count(tag_number) from mms.am_inventory where company="'+str(com)+'" and status="poor";',engine_mms)
    poo_mc=poor.iloc[0,0]
    failed=pd.read_sql('select count(tag_number) from mms.am_inventory where company="'+str(com)+'" and status="failed";',engine_mms)
    fai_mc=failed.iloc[0,0]
    Automation=pd.read_sql('select count(tag_number) from mms.am_inventory where company="'+str(com)+'" and Autotype like "auto%";',engine_mms)
    aut_mc=Automation.iloc[0,0]
    total_mc=pd.read_sql('select count(tag_number) from mms.am_inventory where company="'+str(com)+'";',engine_mms)
    tot_mc=total_mc.iloc[0,0]   
    keyw=str(week)+'_'+str(month)+'_'+str(year)+'_'+str(com)
    query=('replace into mms.am_dashboard '
        + 'values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,now())')
    values=(keyw, str(week), month, str(year),str(com), str(com_name), str(act_mc), str(ina_mc), str(dis_mc), str(goo_mc), str(fai_mc), str(poo_mc), str(aut_mc),str(tot_mc))
    print(query,values)
    myCursor.execute(query, values)
    mydb.commit()
    c=c+1