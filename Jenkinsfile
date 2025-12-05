pipeline {
    agent any

    environment {
        KUBE_DEPLOYMENT = "k8s/devsolutions-app.yaml"

        BACKEND_DOCKER_IMAGE = "devsolutions-backend:latest"
        BACKEND_BUILD_CONTEXT = "app/backend"

        FRONTEND_DOCKER_IMAGE = "devsolutions-frontend:latest"
        FRONTEND_BUILD_CONTEXT = "app/frontend"
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
                // ✅ CORRECTED: If the Dockerfile is named 'Dockerfile' and is in the build context,
                // you only need to specify the build context path.
                sh "docker build -t $BACKEND_DOCKER_IMAGE $BACKEND_BUILD_CONTEXT"
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
                // ✅ CORRECTED: Using the simplified command for the Frontend as well.
                sh "docker build -t $FRONTEND_DOCKER_IMAGE $FRONTEND_BUILD_CONTEXT"
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