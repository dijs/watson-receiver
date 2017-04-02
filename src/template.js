export default ({ body, initialState }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <script>window.__APP_INITIAL_STATE__ = ${initialState}</script>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <title>Watson</title>
        <style>
          .cameras .camera {
            display: inline-block;
            width: 45%;
            margin: 2.5%;
          }
          .cameras .camera img {
            width: 100%;
          }
          .cameras .camera .info .label {
            font-family: sans-serif;
            font-size: 9px;
            float: left;
            margin: 2px;
            padding: 3px;
            background-color: #ea6f6f;
            border-radius: 3px;
            color: white;
          }
        </style>
        <link rel="stylesheet" href="/rc-slider.css" />
      </head>
      <body>
        <div id="root">${body}</div>
        <script type="text/javascript" src="/assets/bundle.js"></script>
      </body>
    </html>
  `;
};
