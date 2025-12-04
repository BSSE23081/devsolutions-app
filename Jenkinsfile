pipeline {

    // Use Docker-in-Docker agent so Docker commands work even on Windows hosts
    agent {
        docker {
            image 'docker:24.0.5-dind'
            args '--privileged -v /var/lib/docker'
        }
    }

    environment {
        // Kubernetes deployment manifest
        KUBE_DEPLOYMENT = "app/k8s/devsolutions-app.yaml"

        // Backend Image Vars
        BACKEND_DOCKER_IMAGE = "devsolutions-backend:latest"
        BACKEND_BUILD_CONTEXT = "app/backend"

        // Frontend Image Vars
        FRONTEND_DOCKER_IMAGE = "devsolutions-frontend:latest"
        FRONTEND_BUILD_CONTEXT = "app/frontend"
    }

    stages {

        stage('Verify Docker') {
            steps {
                sh "docker version"
                sh "docker info"
            }
        }

        stage('Pull Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/BSSE23081/devsolutions-app.git'
            }
        }

        // --- Backend Stages ---
        stage('Build Backend Image') {
            steps {
                sh "docker build -t $BACKEND_DOCKER_IMAGE $BACKEND_BUILD_CONTEXT"
            }
        }

        stage('Push Backend to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds',
                        usernameVariable: 'USER', passwordVariable: 'PASS')]) {

                    sh '''
                        echo "$PASS" | docker login -u "$USER" --password-stdin

                        docker tag ${BACKEND_DOCKER_IMAGE} $USER/${BACKEND_DOCKER_IMAGE}
                        docker push $USER/${BACKEND_DOCKER_IMAGE}
                    '''
                }
            }
        }

        // --- Frontend Stages ---
        stage('Build Frontend Image') {
            steps {
                sh "docker build -t $FRONTEND_DOCKER_IMAGE $FRONTEND_BUILD_CONTEXT"
            }
        }

        stage('Push Frontend to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds',
                        usernameVariable: 'USER', passwordVariable: 'PASS')]) {

                    sh '''
                        docker tag ${FRONTEND_DOCKER_IMAGE} $USER/${FRONTEND_DOCKER_IMAGE}
                        docker push $USER/${FRONTEND_DOCKER_IMAGE}
                    '''
                }
            }
        }

        // --- Deployment Stage ---
        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -f $KUBE_DEPLOYMENT"
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! Both Backend and Frontend are deployed.'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}
