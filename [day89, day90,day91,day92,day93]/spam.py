
import pandas as pd
import numpy as np
from nltk.corpus import stopwords
import nltk
from sklearn import model_selection
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


processed = text_messages.str.replace(r'^.+@[^\.].*\.[a-z]{2,}$',
                                      'emailaddress')
processed = processed.str.replace(r'^http\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(/\S*)?$',
                                  'webaddress')
processed = processed.str.replace(r'£|\$', 'moneysymb')

processed = processed.str.replace(r'^\(?[\d]{3}\)?[\s-]?[\d]{3}[\s-]?[\d]{4}$',
                                  'phonenumbr')
processed = processed.str.replace(r'\d+(\.\d+)?', 'numbr')

processed = processed.str.replace(r'[^\w\d\s]', ' ')

processed = processed.str.replace(r'\s+', ' ')

processed = processed.str.replace(r'^\s+|\s+?$', '')

processed = processed.str.lower()
print(processed)





# remove stop words from text messages

stop_words = set(stopwords.words('english'))

processed = processed.apply(lambda x: ' '.join(
    term for term in x.split() if term not in stop_words))

ps = nltk.PorterStemmer()

processed = processed.apply(lambda x: ' '.join(
    ps.stem(term) for term in x.split()))


from nltk.tokenize import word_tokenize

all_words = []

for message in processed:
    words = word_tokenize(message)
    for w in words:
        all_words.append(w)

all_words = nltk.FreqDist(all_words)


print('Number of words: {}'.format(len(all_words)))
print('Most common words: {}'.format(all_words.most_common(15)))


word_features = list(all_words.keys())[:1500]

def find_features(message):
    words = word_tokenize(message)
    features = {}
    for word in word_features:
        features[word] = (word in words)

    return features

features = find_features(processed[0])
for key, value in features.items():
    if value == True:
        print(key)


messages = list(zip(processed, y))


seed = 1
np.random.seed = seed
np.random.shuffle(messages)


featuresets = [(find_features(text), label) for (text, label) in messages]




training, testing = model_selection.train_test_split(featuresets, test_size = 0.25, random_state=seed)
print(len(training))
print(len(testing))