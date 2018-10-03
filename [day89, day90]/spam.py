
import pandas as pd
import numpy as np
pd.set_option('display.max_columns', None)


df = pd.read_table('SMSSPamCollection', header=None, encoding='utf-8')


print(df.info())
print(df.head(15))

classes = df[0]

print(classes.value_counts())

# Preprocess the data.

from sklearn.preprocessing import LabelEncoder

encoder = LabelEncoder()
y = encoder.fit_transform(classes);

print(classes[:10])
print(y[:10])

#storing the data.

text_messages = df[1]
print(text_messages)

# replace email with mailadd

text_messages.str.replace(r'^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$','mailaddr')
