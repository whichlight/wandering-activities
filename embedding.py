import openai
from dotenv import load_dotenv
import os
import pandas as pd

# Load environment variables from .env file
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Load csv
df = pd.read_csv("activities.csv", header=None)
activities = df[0].tolist()


def get_embedding(text, model="text-embedding-ada-002"):
    text = text.replace("\n", " ")
    print(text)
    return openai.embeddings.create(input=[text], model=model).data[0].embedding


# Apply the get_embedding function to the column containing activities
df["embedding"] = df[0].apply(
    lambda x: get_embedding(x, model="text-embedding-ada-002")
)
df.to_csv("embeddings.csv")
