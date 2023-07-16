import axios from 'axios';
import btoa from 'btoa';

import { getWebsocketUrl } from '../../xf/xf';

export default class VMS {
  appId: string;
  session: string | null = null;
  // domain: string = 'vms.cn-huadong-1.xf-yun.com';
  // domain = 'http://vms.cn-east-1.xf-yun.com';
  domain = 'https://srs-pull.xf-yun.com';

  constructor(appId = '3bb14f18') {
    this.appId = appId;
  }

  async start(uid = '') {
    const res = await axios.post(
      await getWebsocketUrl(
        this.domain + '/v1/private/vms2d_start',
        // 'http://vms.cn-huadong-1.xf-yun.com/v1/private/vms2d_start',
        '/v1/private/vms2d_start',
      ),
      {
        header: {
          app_id: this.appId,
          uid: uid,
        },
        parameter: {
          vmr: {
            stream: {
              protocol: 'rtmp',
            },
            avatar_id: '110278006',
            width: 1280,
            height: 720,
          },
        },
      },
    );

    if (res.data.header.code === 0) {
      this.session = res.data.header.session;
      return {
        stream_urlObj: res.data.payload.stream_url,
        stream_url: res.data.header.stream_url,
      };
    } else {
      throw new Error(res.data.header.message);
    }
  }

  async textDrive(text: string, uid = '') {
    if (!this.session) {
      throw new Error('Session not started');
    }

    const res = await axios.post(
      await getWebsocketUrl(
        this.domain + '/v1/private/vms2d_ctrl',
        '/v1/private/vms2d_ctrl',
      ),
      {
        header: {
          app_id: this.appId,
          session: this.session,
          uid: uid,
        },
        parameter: {
          tts: {
            vcn: 'x3_qianxue',
            speed: 50,
            pitch: 50,
            volume: 50,
          },
        },
        payload: {
          text: {
            encoding: 'utf8',
            status: 3,
            seq: 3,
            text: btoa(text),
          },
          ctrl_w: {
            encoding: 'utf8',
            format: 'json',
            status: 3,
            seq: 3,
          },
        },
      },
    );

    if (res.data.header.code !== 0) {
      throw new Error(res.data.header.message);
    }
  }

  async stop() {
    if (!this.session) {
      throw new Error('Session not started');
    }

    const res = await axios.post(
      await getWebsocketUrl(
        this.domain + '/v1/private/vms2d_stop',
        '/v1/private/vms2d_stop',
      ),
      {
        header: {
          app_id: this.appId,
          session: this.session,
          uid: '',
        },
      },
    );

    if (res.data.header.code === 0) {
      this.session = null;
    } else {
      throw new Error(res.data.header.message);
    }
  }

  async keepAlive() {
    // to maintain session
    if (!this.session) {
      throw new Error('Session not started');
    }

    const res = await axios.post(
      await getWebsocketUrl(
        this.domain + '/v1/private/vms2d_ping',
        '/v1/private/vms2d_ping',
      ),
      {
        header: {
          app_id: this.appId,
          session: this.session,
          uid: '',
        },
      },
    );

    if (res.data.header.code !== 0) {
      throw new Error(res.data.header.message);
    }
  }

  async avatarControl(avatarType: string, avatarValue: string, wb: number) {
    // to control the avatar
    if (!this.session) {
      throw new Error('Session not started');
    }

    const res = await axios.post(
      await getWebsocketUrl(
        this.domain + '/v1/private/vms2d_ctrl',
        '/v1/private/vms2d_ctrl',
      ),
      {
        header: {
          app_id: this.appId,
          session: this.session,
          uid: '',
        },
        parameter: {
          avatar: [
            {
              type: avatarType,
              value: avatarValue,
              wb: wb,
            },
          ],
        },
      },
    );

    if (res.data.header.code !== 0) {
      throw new Error(res.data.header.message);
    }
  }
}
