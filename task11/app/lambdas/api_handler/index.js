import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

// Validate required environment variables
const requiredEnvVars = [
    'cup_id', 'cup_client_id', 'tables_table', 'reservations_table'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}

const USER_POOL_ID = process.env.cup_id;
const CLIENT_ID = process.env.cup_client_id;
const TABLES_TABLE = process.env.tables_table;
const RESERVATIONS_TABLE = process.env.reservations_table;

// Main handler function
export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Request body is missing." })
            };
        }

        const { username, password } = JSON.parse(event.body);
        if (!username || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Username and password are required." })
            };
        }

        // Cognito Authentication
        const authParams = {
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: CLIENT_ID,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password
            }
        };

        const authResponse = await cognito.initiateAuth(authParams).promise();

        if (!authResponse.AuthenticationResult || !authResponse.AuthenticationResult.IdToken) {
            throw new Error("Authentication failed. No token received.");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Login successful",
                token: authResponse.AuthenticationResult.IdToken
            })
        };
    } catch (error) {
        console.error("Error occurred:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
