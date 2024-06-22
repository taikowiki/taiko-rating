# Taiko Analyzer

동더히로바를 이용하여 사용자를 분석합니다.

## 사용법

동더히로바에 접속한 후, 아래 코드를 주소창에 넣고 엔터키를 누르세요. 동더히로바에 로그인이 되어 있어야 합니다.

```
javascript:(async() => {const fetched = await fetch('https://raw.githubusercontent.com/taikowiki/taiko-analyzer/main/build/rating.js');const script = await fetched.text();(new Function(script))();})();
```

## 레이팅

사용자의 플레이 기록을 이용하여 레이팅을 계산합니다.

레이팅의 계산 방법은 다음과 같습니다.

```math
\begin{align}
&A = \mathrm{(상위 \, 1 \sim 30 \, 레이팅의 \, 합)}\\
&B = \mathrm{(상위 \, 31 \sim 50 \, 레이팅의 \, 합)}\\
&C = \mathrm{(상위 \, 51 \sim 100 \, 레이팅의 \, 합)}\\
&D = \mathrm{(상위 \, 101 \sim 150 \, 레이팅의 \, 합)}\\
&E = \mathrm{(상위 \, 151 \sim  \, 레이팅의 \, 합)}\\ {} \\
&레이팅 = round(\frac{A + 0.7\times B}{50} + 0.01 \times C + 0.005 \times D + 0.001 \times E)
\end{align}
```

### 곡 별 레이팅

곡 별 레이팅의 계산 방법은 다음과 같습니다

```math
\mathrm{곡 \, 별 \, 레이팅} = round(\mathrm{(점수의 \, 보정치)} \times \mathrm{(보면 \, 상수)} \times \mathrm{(왕관 \, 보정치)} \div 1000)
```

#### 점수의 보정치

점수의 보정치 계산 방법은 다음과 같습니다.

```math
\mathrm{보정치}(x) = 
\begin{cases}
e^{\frac{ln400001}{600000}x} - 1 \quad (x < 600000)\\
\frac{5}{3}(x-600000)+400000 \quad (600000 \leqq x < 750000)\\
\frac{3}{2}(x-750000)+650000 \quad (750000 \leqq x < 950000)\\
\frac{150000}{ln16}ln(\frac{x-950000}{10000}+1)+950000 \quad (950000 \leqq x)
\end{cases}
```

#### 왕관 보정치

왕관 보정치의 계산 방법은 다음과 같습니다

```
일반: 1
클리어: 1.1
풀콤: 1.3
전량: 1.4
```