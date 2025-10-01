import sys, json
import os
import mysql.connector
import string
import pandas as pd
from sqlalchemy import create_engine
#import random
import datetime
import numpy as np

pd.set_option("display.precision", 2)
engine_hbi_linebalancing = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
engine_hbi_pr2k = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/pr2k', echo=False)
engine_hbi_erpsystem = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/erpsystem', echo=False)

engine_local = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
employee=sys.argv[1]

style_detail=sys.argv[2]
condition=sys.argv[3]


sql_wc=pd.read_sql('select workcenter from aci_data where workcenter is not null and style_detail="'+style_detail+'";',engine_hbi_linebalancing)
wc="x"
if len(sql_wc)>0:
    wc=sql_wc.iloc[0,0]
if condition=="style":
    sql_op=(
            'SELECT erp.id,erp.name,temp.operation_name,temp.workcenter,temp.style_detail,temp.size,temp.date,temp.float_eff,temp.rate FROM '
            +'(SELECT employee,operation_name,size,style_detail,workcenter,DATE,float_eff,ratioop AS rate FROM bundle_group_by_employee_detail '
            +'WHERE operation_name is not null and float_eff IS NOT NULL AND FLOAT_eff<300 and employee="'+str(employee)+'" AND style_detail="'+style_detail+'"  ORDER BY date desc LIMIT 300) AS temp INNER JOIN erpsystem.setup_emplist erp ON temp.employee=RIGHT(erp.ID,5) ORDER BY temp.date desc;'
        )
    dt_op=pd.read_sql(sql_op,engine_hbi_linebalancing)
    print(dt_op.to_json(orient="records"))
if condition=="workcenter":
    sql_op=(
            'SELECT erp.id,erp.name,temp.operation_name,temp.workcenter,temp.style_detail,temp.size,temp.date,temp.float_eff,temp.rate FROM '
            +'(SELECT employee,operation_name,size,style_detail,workcenter,DATE,float_eff,ratioop AS rate FROM bundle_group_by_employee_detail '
            +'WHERE operation_name is not null and float_eff IS NOT NULL AND FLOAT_eff<300 and employee="'+str(employee)+'" AND workcenter="'+wc+'" ORDER BY DATE DESC LIMIT 300) AS temp INNER JOIN erpsystem.setup_emplist erp ON temp.employee=RIGHT(erp.ID,5) ORDER BY temp.date desc;'
        )
    dt_op=pd.read_sql(sql_op,engine_hbi_linebalancing)
    print(dt_op.to_json(orient="records"))
if condition=="all":
    sql_op=(
            'SELECT erp.id,erp.name,temp.operation_name,temp.workcenter,temp.style_detail,temp.size,temp.date,temp.float_eff,temp.rate FROM '
            +'(SELECT employee,operation_name,size,style_detail,workcenter,DATE,float_eff,ratioop AS rate FROM bundle_group_by_employee_detail '
            +'WHERE operation_name is not null and float_eff IS NOT NULL AND FLOAT_eff<300 and employee="'+str(employee)+'" ORDER BY DATE DESC LIMIT 300) AS temp INNER JOIN erpsystem.setup_emplist erp ON temp.employee=RIGHT(erp.ID,5) ORDER BY temp.date desc;'
        )
    dt_op=pd.read_sql(sql_op,engine_hbi_linebalancing)
    print(dt_op.to_json(orient="records"))
