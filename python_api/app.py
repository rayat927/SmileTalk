# import tensorflow
import pickle
import pandas as pd
from pprint import pprint
from sklearn.utils import resample
from tensorflow.keras.models import load_model
import numpy as np

dataset = pd.read_csv('tweet_emotions.csv')

dataset.sentiment.value_counts()
target_class = 9

# classes_ids = {name:ids for name, ids in zip(set(dataset.sentiment.to_list()),range(len(set(dataset.sentiment.to_list()))))}
classes_ids = {name: idx for idx, name  in enumerate(dataset.sentiment.unique())}
inv_classes_ids = {value:key for key, value in zip(list(classes_ids.keys()), list(classes_ids.values()))}

pprint(classes_ids)

target_majority = dataset[dataset.sentiment==inv_classes_ids[target_class]]

for cl in range(len(classes_ids)):
    train_minority = dataset[dataset.sentiment==inv_classes_ids[cl]]
    train_minority_upsampled = resample(train_minority, replace=True, n_samples=len(target_majority), random_state=123)
    if cl == 0:
        dataset_upsampled = pd.concat([train_minority_upsampled, target_majority])
        #train_upsampled = pd.concat([train_upsampled, ])
    if cl>0 and cl!=target_class:
        dataset_upsampled = pd.concat([train_minority_upsampled, dataset_upsampled])
dataset_upsampled = dataset_upsampled.sample(frac=1).reset_index(drop=True)


with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

model = load_model('chatbot6.h5')

test_sentence = ['i am bored']

sequence = tokenizer.texts_to_sequences(test_sentence)

predictions = model.predict(sequence)
print(predictions)
print(np.argmax(predictions))
s = np.argmax(predictions)
p = inv_classes_ids.get(s)
print(p)
