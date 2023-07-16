import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { createProxyMiddleware } from 'http-proxy-middleware';
import next from 'next';
import { v4 as uuidv4 } from 'uuid';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 代理配置
  server.use(
    '/v1/private',
    createProxyMiddleware({
      target: 'https://vms.cn-huadong-1.xf-yun.com',
      changeOrigin: true,
    }),
  );

  server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // '*'允许所有域名访问，也可以指定某一特定域名
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
  });

  server.use(express.static('public')); // Serve HLS files from public directory

  server.get('/convert', (req, res) => {
    // The source RTMP URL should be passed as a query parameter.
    const source = req.query.source;
    if (!source) {
      return res.status(400).send({ error: 'Missing source parameter' });
    }

    // Use a random ID for the output to avoid conflicts.
    const id = uuidv4();
    ffmpeg(source)
      .outputOptions([
        '-preset ultrafast',
        '-acodec aac',
        '-strict -2',
        '-vcodec libx264',
        '-hls_time 5',
        '-hls_list_size 0',
        '-f hls',
      ])
      .output(`public/${id}.m3u8`)
      .on('end', function () {
        console.log('Processing finished successfully');
      })
      .on('error', function (err, stdout, stderr) {
        console.log('Error occurred: ' + err.message, err, stdout, stderr);
      })
      .on('progress', function (progress) {
        console.log('Processing: ' + progress.percent + '% done');
      })
      .run();

    // Respond with the URL of the HLS stream.
    res.send({ url: `https://srs-pull.xf-yun.com:3000/${id}.m3u8` });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
