function getPicShader(baseTexture, noiseTexture) {
  return {

    uniforms: {
      baseTexture: 	{ type: "t", value: baseTexture },
      baseSpeed: 		{ type: "f", value: 0.07 },
      noiseTexture: 	{ type: "t", value: noiseTexture },
      noiseScale:		{ type: "f", value: 0.3 },
      alpha: 			{ type: "f", value: 1.0 },
      time: 			{ type: "f", value: 1.0 }
    },

    vertexShader: [
      'varying vec2 vUv;',
      'void main() {',
      'vUv = uv;',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join("\n"),

    fragmentShader: [
      'uniform sampler2D baseTexture;',
      'uniform float baseSpeed;',
      'uniform sampler2D noiseTexture;',
      'uniform float noiseScale;',
      'uniform float alpha;',
      'uniform float time;',

      'varying vec2 vUv;',
      'void main()',
      '{',
        'vec2 uvTimeShift = vUv + vec2( -0.4, 0.8 ) * time * baseSpeed;',
        'vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );',
        'vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.b );',
        'vec4 baseColor = texture2D( baseTexture, uvNoiseTimeShift );',

        'baseColor.a = alpha;',
        'gl_FragColor = baseColor;',
      '}'
    ].join("\n")
  };
}
