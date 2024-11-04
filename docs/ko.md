# Taiko Rating

동더히로바를 이용하여 레이팅을 계산합니다.

## 사용법

동더히로바에 접속한 후, 아래 코드를 주소창에 넣고 엔터키를 누르세요. 동더히로바에 로그인이 되어 있어야 합니다.

크로미움 기반 브라우저에서는 `javascript:`를 먼저 입력하고 아래 코드를 붙여넣으세요.

```
javascript:(async() => {const fetched = await fetch('https://raw.githubusercontent.com/taikowiki/taiko-rating/main/build/rating.js');const script = await fetched.text();(new Function(script))();})();
```

이후 위키(https://taiko.wiki) 에서 확인할 수 있습니다.

## 경험치

사용자의 플레이 기록을 이용하여 경험치 계산합니다.

경험치 계산 방법은 다음과 같습니다.

```math
\begin{align}
&A = \mathrm{(상위 \, 1 \sim 30 \, 레이팅의 \, 합)}\\
&B = \mathrm{(상위 \, 31 \sim 50 \, 레이팅의 \, 합)}\\
&C = \mathrm{(상위 \, 51 \sim 100 \, 레이팅의 \, 합)}\\
&D = \mathrm{(상위 \, 101 \sim 150 \, 레이팅의 \, 합)}\\
&E = \mathrm{(상위 \, 151 \sim  \, 레이팅의 \, 합)}\\ {} \\
&레이팅 = ceil(\frac{A + 0.9\times B}{50} + 0.01 \times C + 0.001 \times D + 0.0001 \times E)
\end{align}
```

## 레이팅

레이팅은 
```math
(상위\,50개\,곡별\,레이팅의\,합) / 50
```
 입니다.

### 곡 별 레이팅

곡 별 레이팅의 계산 방법은 다음과 같습니다

```math
\mathrm{곡 \, 별 \, 레이팅} = ceil(\mathrm{(정확도 \, 보정치)} \times \mathrm{(보면 \, 상수)} \times \mathrm{(왕관 \, 보정치)} \div 1000)
```

### 정확도

정확도는 다음과 같이 구할 수 있습니다.

```math
\mathrm{정확도} = (\frac{\mathrm{량개수 \times 2 + 가개수}}{\mathrm{최대노트수 \times 2}} + min(0.05, 연타수 \times 0.0001)) \times 100
```

#### 정확도 보정치

정확도 보정치 계산 방법은 다음과 같습니다.

```math
\mathrm{보정치}(x) = 
\begin{cases}
e^{\frac{ln400001}{600000}10000x} - 1 \quad (10000x < 600000)\\
\frac{5}{3}(10000x-600000)+400000 \quad (600000 \leqq 10000x < 750000)\\
\frac{3}{2}(10000x-750000)+650000 \quad (750000 \leqq 10000x < 950000)\\
\frac{150000}{ln16}ln(\frac{10000x-950000}{10000}+1)+950000 \quad (950000 \leqq x)
\end{cases}
```

#### 왕관 보정치

왕관 보정치의 계산 방법은 다음과 같습니다

```
미클리어: 0.7
클리어: 1
풀콤: 1.1
전량: 1.15
```
