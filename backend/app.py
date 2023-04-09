# Need to fix the food_list thingy for get_recipe() so that it can be called without being a parameter
#Fix formatting (convert from n line to table)
from flask import Flask, request, jsonify, render_template
import openai
import os
import replicate
import requests
import base64
import json
import ast
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

api_key = "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"

openai.api_key = api_key

@app.route('/get_recipe', methods=['POST'])    
def get_recipe():
    # Access parameters from the HTTP request
    # food_list = request.args.get('food_list')  # Retrieve 'food_list' parameter from the HTTP query string
    #food_list = {'url' : request.json['url']}
    api_key = "16fa4ec880575aa78d9bded50e4d226c7b7cc47c"
    endpoint = "andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608"
    client = replicate.Client(api_token=api_key)
    image_url = request.json['url']
    img_data = requests.get(image_url).content
    with open("image.jpg", "wb") as file:
        file.write(img_data)
    answer= client.run(
    endpoint,
    input={"image": open("image.jpg", "rb"), "question": 'find every object in the image', "context": ""})
    print(answer)
    prompt = f"Give me a list of recipes using only: {answer}. You must number each of the food recipes and EXPICITLY tell the food recipe name not how to make the recipe"  # Update the prompt with the food_list parameter
    parameters = {"prompt": prompt, "temperature": 0.5, "max_tokens": 500, "top_p": 1, "frequency_penalty": 0, "presence_penalty": 0}
    response = openai.Completion.create(model="text-davinci-003", **parameters)
    recipe = response.choices[0].text.strip()
    print(recipe)
    return jsonify({'recipe': recipe, 'foods': answer})
    
# Is Rotten and the other Question thingies
@app.route('/get_info', methods=['POST'])
def get_info():

    api_key = "16fa4ec880575aa78d9bded50e4d226c7b7cc47c"
    endpoint = "andreasjansson/blip-2:4b32258c42e9efd4288bb9910bc532a69727f9acd26aa08e175713a0a857a608"
    client = replicate.Client(api_token=api_key)
    image_url = request.json['url']
    img_data = requests.get(image_url).content
    with open("image.jpg", "wb") as file:
        file.write(img_data)

    output = client.run(
        endpoint,
        input={"image": open("image.jpg", "rb"), "question": "What consumable food item is this", "context": ""}
    )
    print(output)
    prompt = f"Create questions to determine visually determine the condition of {output}, return as a python string list. Do not ask questions about oder or smell. Ask one question if the object is moldy or rotten or safe to eat. Do not return anything else just return a array. Example: ['Bob', 'bread']"
    parameters = {"prompt": prompt, "temperature": 0.5, "max_tokens": 500, "top_p": 1, "frequency_penalty": 0, "presence_penalty": 0}
    response = openai.Completion.create(model="text-davinci-003", **parameters)
    questions = response.choices[0].text.strip()
    print(questions)
    questions_list = ast.literal_eval(questions)
    result = []
    for thing in questions_list:
        answer= client.run(
        endpoint,
        input={"image": open("image.jpg", "rb"), "question": thing, "context": ""})
        result.append(answer)
    print(result)
    questions_string = ' '.join(questions_list)
    answers_string = ' '.join(result)
    prompt2 = f"Write a descriptive paragraph using the answers to {questions_string} neatly if the answers are {answers_string} respectively"
    parameters2 = {"prompt": prompt2, "temperature": 0.5, "max_tokens": 500, "top_p": 1, "frequency_penalty": 0, "presence_penalty": 0}
    response2 = openai.Completion.create(model="text-davinci-003", **parameters2)
    print(response2.choices[0].text)
    
    return response2.choices[0].text


#get_info('test.jpg')
if __name__ == '__main__':
    app.run(port=8000, debug=True)

# 5f5046ce0cad08641d362c20c0a678152d6d425b (tokencd)