pipeline {
    agent any

    environment {
        // Corrected path for the Kubernetes deployment manifest
        KUBE_DEPLOYMENT = "app/k8s/devsolutions-app.yaml"

        // Backend Image Variables
        BACKEND_DOCKER_IMAGE = "devsolutions-backend:latest"
        BACKEND_DOCKERFILE_PATH = "./app/backend"

        // Frontend Image Variables
        FRONTEND_DOCKER_IMAGE = "devsolutions-frontend:latest"
        FRONTEND_DOCKERFILE_PATH = "./app/frontend" 
    }

    stages {
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
                // Using the corrected path: ./app/backend
                sh "docker build -t $BACKEND_DOCKER_IMAGE -f $BACKEND_DOCKERFILE_PATH/Dockerfile $BACKEND_DOCKERFILE_PATH"
            }
        }

        stage('Push Backend to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        echo "$PASS" | docker login -u "$USER" --password-stdin
                        
                        # Tag and push Backend image
                        docker tag $BACKEND_DOCKER_IMAGE $USER/$BACKEND_DOCKER_IMAGE
                        docker push $USER/$BACKEND_DOCKER_IMAGE
                    '''
                }
            }
        }
        
        // --- Frontend Stages ---
        stage('Build Frontend Image') {
            steps {
                // Build Frontend image using the path: ./app/frontend
                sh "docker build -t $FRONTEND_DOCKER_IMAGE -f $FRONTEND_DOCKERFILE_PATH/Dockerfile $FRONTEND_DOCKERFILE_PATH"
            }
        }

        stage('Push Frontend to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                        # Tag and push Frontend image
                        docker tag $FRONTEND_DOCKER_IMAGE $USER/$FRONTEND_DOCKER_IMAGE
                        docker push $USER/$FRONTEND_DOCKER_IMAGE
                    '''
                }
            }
        }

        // --- Deployment Stage ---
        stage('Deploy to Kubernetes') {
            steps {
                // Uses the corrected KUBE_DEPLOYMENT path: app/k8s/devsolutions-app.yaml
                echo "Deploying application using $KUBE_DEPLOYMENT"
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