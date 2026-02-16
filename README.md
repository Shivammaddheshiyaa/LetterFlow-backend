Live Demo: https://letterflow-frontend-2.vercel.app/

✨ Features

👤 User Features

. JWT Authentication (Signup/Login)  

. Write anonymous letters

. Add delivery address

. Preview letter before payment

. Secure payment with Razorpay

. Track order status

. Order history dashboard

🛠 Admin Features

. Admin dashboard

. Update order status (pending → shipped → delivered)

. View all users' orders


🧱 Tech Stack

Frontend

React.js

React Router

Axios

Tailwind CSS

Vercel (Deployment)


Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

Razorpay Payment Gateway

Render (Deployment)

🛠 Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/Shivammaddheshiyaa/letterflow-frontend

git clone https://github.com/Shivammaddheshiyaa/LetterFlow-backend

⚙️ Backend Setup
cd backend
npm install

Create .env file:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
CLIENT_URL=http://localhost:3000

Run backend
npm run dev

🎨 Frontend Setup
cd frontend
npm install

Create .env:
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RAZORPAY_KEY_ID=your_key

Run frontend
npm start
