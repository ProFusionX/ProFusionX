## ProFusionX

ProFusionX is a platform designed to connect mentors and mentees for learning and growth. This project is built using Next.js and integrates with MongoDB for data storage.

### Table of Contents

+ [Installation](#installation)
+ [Usage](#usage)
+ [Environment Variables](#environment-variables)
+ [Contributing](#contributing)
+ [License](#license)icense

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/profusionx.git
cd profusionx
```

2. install the dependencies:
```
npm install
```

3. Create a **.env.local** file in the root of the project and add your environment variables

4. Run the development server:
```
npm run dev
```
Open http://localhost:3000 with your browser to see the result.

### Usage

To build and start the production server:
```
npm run build
npm start
```

### Environment Variables

Create a **.env.local** file in the root of your project and add the following environment variables:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.