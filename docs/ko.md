# Taiko Rating

동더히로바를 이용하여 레이팅을 계산합니다.

## 가이드

[Donderhiroba Plus](https://chromewebstore.google.com/detail/donder-hiroba-plus/dmendcaacmlddhgalacgccejbamnncci) 와 [taiko.wiki](https://taiko.wiki) 를 통해 레이팅을 확인할 수 있는 [가이드](/docs/guide/ko.md)가 있습니다.

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