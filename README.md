# Web-AI
Vasyl Popovych
Coursework
![Web AI](https://github.com/user-attachments/assets/2792bbf5-0788-44a0-9cff-038d437c1d08)


```
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

```
git clone https://github.com/pvasya/Web-AI.git
```
frontend
```
cd frontend
npm i
npm run dev
```
backend
Google cloud GPU VM with CUDA 12.x

create rule for port TCP 3000

frontend 
in frontend/src/components/Main.jsx change localhost at your VM instance external IP

```
wget https://developer.download.nvidia.com/compute/cuda/repos/debian12/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get -y install cudnn

cd backend
npm i
npm start
```
