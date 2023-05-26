
if (process.env.AWS_SECRET_ACCESS_KEY.includes('/') || process.env.AWS_SECRET_ACCESS_KEY.includes('\\')) {
	console.log('AWS_SECRET_ACCESS_KEY contains slashes. Regenerate the AWS AKIA/key pair and try again. Slashes in AWS secrets result in a working app but syndication functionality not working.') // eslint-disable-line no-console
	process.exit(1); // Exit the script with a non-zero exit code to indicate failure
}

if (process.env.ES_AWS_SECRET_ACCESS_KEY.includes('/') || process.env.ES_AWS_SECRET_ACCESS_KEY.includes('\\')) {
	console.log('ES_AWS_SECRET_ACCESS_KEY contains slashes. Regenerate the AWS AKIA/key pair and try again. Slashes in AWS secrets result in a working app but syndication functionality not working.') // eslint-disable-line no-console
	process.exit(1); // Exit the script with a non-zero exit code to indicate failure
}

console.log(`AWS secret check passed ${process.env.AWS_SECRET_ACCESS_KEY.charAt(0)}${process.env.ES_AWS_SECRET_ACCESS_KEY.charAt(0)}`); // eslint-disable-line no-console

process.exit(0); 
