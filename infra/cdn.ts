import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()
const bucketName = config.require('bucketName')

const bucket = new aws.s3.Bucket('animation-app-bucket', {
  bucket: bucketName,
  website: { indexDocument: 'index.html', errorDocument: 'index.html' },
})

const cdn = new aws.cloudfront.Distribution('animation-app-cdn', {
  enabled: true,
  defaultRootObject: 'index.html',
  origins: [{
    domainName: bucket.websiteEndpoint,
    originId: 'S3Origin',
    customOriginConfig: {
      httpPort: 80,
      httpsPort: 443,
      originProtocolPolicy: 'http-only',
      originSslProtocols: ['TLSv1.2'],
    },
  }],
  defaultCacheBehavior: {
    targetOriginId: 'S3Origin',
    viewerProtocolPolicy: 'redirect-to-https',
    allowedMethods: ['GET', 'HEAD'],
    cachedMethods: ['GET', 'HEAD'],
    forwardedValues: { queryString: false, cookies: { forward: 'none' } },
    minTtl: 0,
    defaultTtl: 86400,
    maxTtl: 31536000,
  },
  orderedCacheBehaviors: [
    {
      pathPattern: '/assets/*.js',
      targetOriginId: 'S3Origin',
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD'],
      cachedMethods: ['GET', 'HEAD'],
      forwardedValues: { queryString: false, cookies: { forward: 'none' } },
      minTtl: 31536000,
      defaultTtl: 31536000,
      maxTtl: 31536000,
    },
    {
      pathPattern: '/assets/*.css',
      targetOriginId: 'S3Origin',
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD'],
      cachedMethods: ['GET', 'HEAD'],
      forwardedValues: { queryString: false, cookies: { forward: 'none' } },
      minTtl: 86400,
      defaultTtl: 86400,
      maxTtl: 86400,
    },
    {
      pathPattern: '/api/*',
      targetOriginId: 'S3Origin',
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'POST', 'PATCH', 'DELETE'],
      cachedMethods: ['GET', 'HEAD'],
      forwardedValues: { queryString: true, cookies: { forward: 'all' } },
      minTtl: 0,
      defaultTtl: 0,
      maxTtl: 0,
    },
  ],
  restrictions: { geoRestriction: { restrictionType: 'none' } },
  viewerCertificate: { cloudfrontDefaultCertificate: true },
})

export const cdnDomain = cdn.domainName
export const bucketId = bucket.id
