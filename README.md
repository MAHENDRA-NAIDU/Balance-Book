# Balance Book

Balance Book is a digital ledger full-stack web application designed to track money given and received across various purposes. It supports English, Hindi, and Telugu, with an intuitive and responsive interface.

## Features
- **Person Management**: Add, view, search, and delete persons based on predefined purposes (Marriage, House Construction, Loan, Workers, Function, Medical, Others).
- **Transaction Management**: Record 'given' and 'received' amounts for any person with dynamic balance calculation.
- **Multilingual UI**: Dynamically switch between English, Hindi, and Telugu.
- **Visual Analytics**: Interactive Pie Chart for purpose distribution and Bar Chart for monthly summaries.

## Tech Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript, Chart.js
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB server)

## Local Setup Instructions

1. **Install Dependencies**
   Navigate to the project root directory and run:
   ```bash
   npm install
   ```

2. **Database Configuration**
   - Create a free cluster on MongoDB Atlas (https://www.mongodb.com/cloud/atlas).
   - Get the connection string.
   - Edit the `.env` file in the project root and replace the `MONGO_URI` value with your connection string:
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/balance-book?retryWrites=true&w=majority
     ```

3. **Start the Application**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open your browser and navigate to `http://localhost:5000`

## Deployment Steps

### Backend Deployment (Render)
1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com) and create a new "Web Service".
3. Connect your GitHub repository.
4. Set the Build Command to: `npm install`
5. Set the Start Command to: `npm start`
6. Add the environment variables (`MONGO_URI` and `PORT`) in the Render dashboard.

### Frontend Deployment (Vercel)
You can deploy the frontend separately by pointing Vercel to the `client` folder.
1. Go to [Vercel](https://vercel.com) and import your GitHub repository.
2. Set the "Root Directory" to `client`.
3. Vercel will auto-detect it as a static deployment.
4. Note: If deploying separately, you must update the `API_URL` in `client/script.js` from `http://localhost:5000/api` to your Render backend URL.

**Tip:** Alternatively, since the Node server serves the frontend static files (`app.use(express.static(...))`), deploying the entire repository to Render will host both the frontend and backend on the same URL without any further changes!
