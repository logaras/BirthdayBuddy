import '../utils/env'
import { App, LogLevel } from '@slack/bolt'

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	appToken: process.env.SLACK_APP_TOKEN,
	socketMode: process.env.NODE_ENV === 'production' && process.env.FORCE_SOCKET === 'false' ? false : true,
	logLevel: LogLevel.DEBUG,
	customRoutes: [
		{
		  path: '/health-check',
		  method: ['GET'],
		  handler: (req, res) => {
			res.writeHead(200);
			res.end('OK');
		  },
		},
	  ]
})

export default app
