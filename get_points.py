import pandas as pd
from sklearn.manifold import TSNE
import ast
import numpy as np


df = pd.read_csv("embeddings.csv")

df["embedding"] = df["embedding"].apply(ast.literal_eval)
df = df.rename(columns={"0": "activity"})
print(df.columns)
print(df.iloc[:10, 1])


embeddings_array = np.array(df["embedding"].tolist())


# Create a t-SNE model and transform the data
tsne = TSNE(
    n_components=2, perplexity=15, random_state=42, init="random", learning_rate=200
)

tsne_results = tsne.fit_transform(embeddings_array)


df["tsne-2d-one"] = tsne_results[:, 0]
df["tsne-2d-two"] = tsne_results[:, 1]

output_df = df[["activity", "tsne-2d-one", "tsne-2d-two"]]
output_df.to_csv("tsne_output.csv", index=False)
output_df.to_json("tsne_output.json", orient="records")
