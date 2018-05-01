import { graphqlLambda } from 'apollo-server-lambda';
import lambdaPlayground from 'graphql-playground-middleware-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import depthLimit from 'graphql-depth-limit';
import debug from 'debug';

import typeDefs from './graphql/typeDefs';
import { default as resolvers, createDirectives } from './graphql/resolvers';
import connectToDatabase from './dataLayer';

const log = debug('fcc:handler');

export const graphqlSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  directiveResolvers: createDirectives(),
  logger: console
});

exports.graphqlHandler = async function graphqlHandler(
  event,
  context,
  callback
) {
  /* Cause Lambda to freeze the process and save state data after
  the callback is called. the effect is that new handler invocations
  will be able to re-use the database connection.
  See https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
  and https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs */
  context.callbackWaitsForEmptyEventLoop = false;

  function callbackFilter(error, output) {
    if (!output.headers) {
      output.headers = {};
    }
    // eslint-disable-next-line no-param-reassign
    output.headers['Access-Control-Allow-Origin'] = '*';
    output.headers['Access-Control-Allow-Credentials'] = true;
    output.headers['Content-Type'] = 'application/json';

    callback(error, output);
  }

  const handler = graphqlLambda((event, context) => {
    const { headers } = event;
    const { functionName } = context;

    return {
      schema: graphqlSchema,
      context: {
        headers,
        functionName,
        event,
        context
      },
      validationRules: [depthLimit(10)]
    };
  });

  try {
    await connectToDatabase();
  } catch (err) {
    log('MongoDB connection error: ', err);
    // TODO: return 500?
    /* eslint-disable no-process-exit */
    process.exit();
    /* eslint-enable no-process-exit */
  }
  return handler(event, context, callbackFilter);
};

exports.apiHandler = lambdaPlayground({
  endpoint: process.env.GRAPHQL_ENDPOINT_URL
    ? process.env.GRAPHQL_ENDPOINT_URL
    : '/production/graphql'
});
