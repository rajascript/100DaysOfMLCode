import sqlite3
import json
from datetime import datetime

timeframe = '2015-01'
sql_transaction = []

connection = sqlite3.connect('{}.db'.format(timeframe))
c = connection.cursor()


def create_table():
    c.execute("CREATE TABLE IF NOT EXISTS parent_reply(parent_id TEXT PRIMARY KEY, comment_id TEXT UNIQUE, parent TEXT, comment TEXT, subreddit TEXT, unix INT, score INT)")


def format_data(data):
    data = data.replace("\n", " newlinechar ").replace(
        "\r", " newlinechar ").replace('"', "'")
    return data


def find_parent(parent_id):
    try:
        sql = "SELECT comment FROM parent_reply WHERE comment_id = '{}' LIMIT 1".format(
            parent_id)
        c.execute(sql)
        result = c.fetchone()
        if result != None:
            return result[0]
        else:
            return False
    except Exception as e:
        print("find parent", e)
        return False


def acceptable(data):
    if len(data.split(' ')) > 50 or len(data) < 1:
        return False
    elif len(data) > 1000:
        return False
    elif data == '[deleted]' or data == '[removed]':
        return False
    else:
        return True


def find_score(parent_id):
    try:
        sql = "SELECT score FROM parent_reply WHERE parent_id = '{}' LIMIT 1".format(
            parent_id)
        c.execute(sql)
        result = c.fetchone()
        if result != None:
            return result[0]
        else:
            return False
    except Exception as e:
        print("find score", e)
        return False


def transaction_bldr(statement):
    global sql_transaction
    sql_transaction.append(statement)
    if len(sql_transaction) > 1000:
        c.execute('BEGIN TRANSACTION')
        for s in sql_transaction:
            try:
                c.execute(s)
            except:
                pass
        connection.commit()
        sql_transaction = []


def insert_replace_data(comment_id, parent_id, parent_data, body, subreddit, created_utc, score):
    try:
        sql = """UPDATE parent_reply SET parent_id = ?, comment_id = ?, parent = ?, comment = ?, subreddit = ?, unix = ?, score = ? WHERE parent_id =?;""".format(
            parent_id, comment_id, parent_data, body, subreddit, int(created_utc), score, parent_id)
        transaction_bldr(sql)
    except Exception as e:
        print("insert replace", e)


def insert_has_parent(comment_id, parent_id, parent_data, body, subreddit, created_utc, score):
    try:
        sql = """INSERT INTO parent_reply (parent_id, comment_id, parent, comment, subreddit, unix, score) VALUES ("{}","{}","{}","{}","{}",{},{});""".format(
            parent_id, comment_id, parent_data, body, subreddit, int(created_utc), score)
        transaction_bldr(sql)
    except Exception as e:
        print("insert replace", e)


def insert_no_parent(comment_id, parent_id, body, subreddit, created_utc, score):
    try:
        sql = """INSERT INTO parent_reply (parent_id, comment_id, comment, subreddit, unix, score) VALUES ("{}","{}","{}","{}",{},{});""".format(
            parent_id, comment_id, body, subreddit, int(created_utc), score, parent_id)
        transaction_bldr(sql)
    except Exception as e:
        print("insert replace", e)


if __name__ == "__main__":
    create_table()
    row_counter = 0
    paired_rows = 0

    with open("/Users/Th3D4rKnight/Desktop/RC_{}/RC_{}".format(timeframe.split('-')[0], timeframe), buffering=1000) as f:
        for row in f:
            row_counter += 1
            row = json.loads(row)
            parent_id = row['parent_id']
            body = format_data(row['body'])
            created_utc = row['created_utc']
            score = row['score']
            subreddit = row['subreddit']
            comment_id = row['name']
            parent_data = find_parent(parent_id)

            if score >= 2:
                if acceptable(body):
                    existing_score = find_score(parent_id)
                    if existing_score:
                        if existing_score < score:
                            insert_replace_data(
                                comment_id, parent_id, parent_data, body, subreddit, created_utc, score)
                    else:
                        if parent_data:
                            insert_has_parent(
                                comment_id, parent_id, parent_data, body, subreddit, created_utc, score)
                            paired_rows += 1
                        else:
                            insert_no_parent(
                                comment_id, parent_id, body, subreddit, created_utc, score)

print("done")
