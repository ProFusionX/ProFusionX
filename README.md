## ProFusionX

ProFusionX is a platform to connect mentors and mentees for learning and growth. The aim is to empower meaningful connections, knowledge sharing, and development for all parties involved. It's designed to bridge the gap for junior talent struggling to get employed.

This platform is still at the early stages of development.

**Mentees:** Gain practical experience, build your portfolio, and get a foot in the industry by working on innovative projects.

**Mentors:** Find reliable, skilled subordinates to delegate tasks, freeing up time for high-leverage work while paying it forward.

This project uses Next.js, TypeScript, and TailwindCSS, and integrates with MongoDB for data storage.

### Table of Contents

+ [Installation](#installation)
+ [Usage](#usage)
+ [Environment Variables](#environment-variables)
+ [Contributing](#contributing)
+ [License](#license)

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

Contributions are welcome! Please open an issue or submit a pull request for any changes. For detailed tasks and action plan, please refer to our [Notion page](https://www.notion.so/smngvlkz/The-Action-Plan-1673b153c5364872b1f24a87b1cd594d?pvs=4) - Please note, the link is invite only

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
