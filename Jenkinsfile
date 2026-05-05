pipeline {
    agent any

    triggers { githubPush() }

    environment {
        GITHUB_REPO  = 'git@github.com:Wambaforestin/mon-app-test-pipeline-as-code.git'
        APP_NAME     = 'mon-app-test-pipeline-as-code'
        GITHUB_USER  = 'Jenkins CI'
        GITHUB_EMAIL = 'jenkins@ci.local'
        SSH_CRED_ID  = 'github-ssh-key'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Récupération du code source...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '🔨 Build de l image Docker...'
                sh 'docker build -t ${APP_NAME}:${BUILD_NUMBER} .'
            }
        }

        stage('Export HTML Static') {
            steps {
                echo '📤 Export HTML statique...'
                sh '''
                    CONTAINER_ID=$(docker create \
                        -e NEXT_PUBLIC_BASE_PATH=/${APP_NAME} \
                        ${APP_NAME}:${BUILD_NUMBER} \
                        sh -c "npm run build")
                    docker start -a $CONTAINER_ID
                    docker cp $CONTAINER_ID:/app/out ${WORKSPACE}/out
                    docker rm $CONTAINER_ID
                '''
            }
        }

        stage('Deploy GitHub Pages') {
            steps {
                echo '🚀 Déploiement sur GitHub Pages...'
                sshagent([SSH_CRED_ID]) {
                    sh '''
                        cd ${WORKSPACE}/out
                        touch .nojekyll
                        git init
                        git config user.email "${GITHUB_EMAIL}"
                        git config user.name "${GITHUB_USER}"
                        git add .
                        git commit -m "deploy: build ${BUILD_NUMBER}"
                        git push -f ${GITHUB_REPO} HEAD:gh-pages
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Déployé sur https://Wambaforestin.github.io/${APP_NAME}/"
        }
        failure {
            echo '❌ Pipeline échoué — consulte la Console Output'
        }
        always {
            sh 'docker rmi ${APP_NAME}:${BUILD_NUMBER} || true'
        }
    }
}
