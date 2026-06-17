# Tekken Win Predictor
An app used to create a win prediction in Tekken 8 against your opponent. Input you and your opponent's information, then click submit to predict who will win. This app utilizes data from the wavu wank API, collecting 3-12 million records of matches played in the past. The 1st layer utilizes a NN to create an embedding of each player, then the 2nd layer utilizes a NN head classifier to take in the embeddings and create a prediction. Finally, the 3rd layer uses FastAPI to connect to the frontend and use a Groq LLM (llama3-8b-8192) to output the win probability. 

## User Instructions
- Insert your own username, player ID and character.
- Insert opponent username, player ID and character.
- Submit to obtain winrate percentage against your opponent.

### Bonus Feature For New Players
- Click on find your character 
- Answer the quiz questions based on your preferences
- After the last question it gives you reccomendations of characters based on your answers

## Dev Instructions:
1. Open virtual environment. 
- Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
- python -m venv .venv
- .venv\Scripts\Activate.ps1
2. Run these commands:
- pip install requests pandas jupyter torch
- pip install torch scikit-learn
- pip install -r backend/requirements.txt
3. Create a .env file on your root.
- Add GROQ_API_KEY for your Groq API Key.
- Add GROQ_API_URL for your Groq API URL.
- Add GROQ_MODEL for your chosen Groq Model.
4. Run these files in this order.
- CD to scripts. Run "python collect_data.py" THIS WILL TAKE A LONG TIME. It will collect millions of records and deposit them to the data folder.
- CD back to root. Run 01_data_exploration.ipynb using the button at the top to visualize the data collected.
- Run feature_engineering.ipynb to collect the training data. 
- Run train.ipynb to collect the model, it will be saved at the models folder.
5. Start the Backend API.
- .venv\Scripts\uvicorn.exe backend.app:app --reload --port 5000
6. Start the Frontend. 
- cd frontend
- python -m http.server 8000
