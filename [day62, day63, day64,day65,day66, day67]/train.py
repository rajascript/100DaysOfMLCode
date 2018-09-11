import sqlite3
import pandas as pd
timeframes = ['2015-01']

for timeframe in timeframes:
    connection = sqlite3.connect('{}.db'.format(timeframe))
    c = connection.cursor()
    limit = 4500
    last_utc = 0
    cur_len = limit
    counter = 0
    done = False
    while cur_len == limit:        
        df = pd.read_sql("SELECT * FROM parent_reply WHERE unix > {} AND parent NOT NULL AND score > 0 ORDER BY unix ASC LIMIT {}".format(last_utc,limit),connection)
        last_utc = df.tail(1)['unix'].values[0] 
        cur_length = len(df)
        if not done:
            with open("test.from",'a',encoding="utf8") as f:
                for content in df['parent'].values:
                    f.write(content+'\n')
            with open("test.to",'a',encoding="utf8") as f:
                for content in df['comment'].values:
                    f.write(content+'\n') 
            done = True
        else:
            with open("train.from",'a',encoding="utf8") as f:
                for content in df['parent'].values:
                    f.write(content+'\n')
            with open("train.to",'a',encoding="utf8") as f:
                for content in df['comment'].values:
                    f.write(content+'\n')
        counter+=1
        if counter%20 == 0:
            print(counter*limit,"rows completed")                                               