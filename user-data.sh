#!/bin/bash
# EC2 User Data Script for AWS AI Blog

# 로그 파일 설정
LOG_FILE="/var/log/blog-deployment.log"
exec > >(tee -a $LOG_FILE)
exec 2>&1

echo "=== Starting AWS AI Blog Deployment ==="
echo "Timestamp: $(date)"

# 시스템 업데이트
echo "Updating system packages..."
sudo yum update -y

# Git 설치
echo "Installing Git..."
sudo yum install -y git

# Python3 확인
echo "Checking Python3..."
python3 --version

# 프로젝트 디렉토리 생성
echo "Creating project directory..."
cd /home/ec2-user
rm -rf ray1derer-blog

# GitHub에서 코드 클론
echo "Cloning from GitHub..."
git clone https://github.com/ray1derer/ray1derer-blog.git
cd ray1derer-blog

# 권한 설정
echo "Setting permissions..."
sudo chown -R ec2-user:ec2-user /home/ec2-user/ray1derer-blog

# 기존 프로세스 종료
echo "Stopping existing processes..."
sudo pkill -f "python.*http.server" || true

# 웹 서버 시작 (포트 80)
echo "Starting web server on port 80..."
sudo nohup python3 -m http.server 80 > server.log 2>&1 &

# 방화벽 설정 (필요시)
echo "Configuring firewall..."
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT || true

# 서비스 상태 확인
sleep 5
if pgrep -f "python.*http.server" > /dev/null; then
    echo "✅ Web server is running successfully!"
    echo "🌐 Access URL: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
else
    echo "❌ Failed to start web server"
fi

echo "=== Deployment completed at $(date) ==="