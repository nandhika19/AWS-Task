package com.task03;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.syndicate.deployment.annotations.lambda.LambdaHandler;
import com.syndicate.deployment.model.RetentionSetting;

import java.util.HashMap;
import java.util.Map;

@LambdaHandler(
		lambdaName = "hello_world",
		roleName = "hello_world-role",
		isPublishVersion = true,
		aliasName = "${lambdas_alias_name}",
		logsExpiration = RetentionSetting.SYNDICATE_ALIASES_SPECIFIED
)
public class HelloWorld implements RequestHandler<Object, Map<String, Object>> {

	private static final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public Map<String, Object> handleRequest(Object request, Context context) {
		System.out.println("Hello from lambda");

		// Create response body (including statusCode inside body)
		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("statusCode", 200);
		responseBody.put("message", "Hello from Lambda");

		String responseBodyString;
		try {
			responseBodyString = objectMapper.writeValueAsString(responseBody);
		} catch (Exception e) {
			throw new RuntimeException("Error serializing response body", e);
		}

		// Construct API Gateway Proxy response
		Map<String, Object> response = new HashMap<>();
		response.put("statusCode", 200);
		response.put("headers", new HashMap<String, String>() {{
			put("Content-Type", "application/json");
		}});
		response.put("body", responseBodyString);

		return response;
	}
}
