# Taiko Rating

Calculates ratings using Donder Hiroba.

- [한국어](/docs/ko.md)

## Guide

Here is a [guide](/docs/guide/en.md) to how to watch your rating using [Donderhiroba Plus](https://chromewebstore.google.com/detail/donder-hiroba-plus/dmendcaacmlddhgalacgccejbamnncci) and [taiko.wiki](https://taiko.wiki).

## Experience Points

Experience points are calculated based on the user's play records.

The calculation method for experience points is as follows:

```math
\begin{align}
&A = \mathrm{(Sum \, of \, top \, 1 \sim 30 \, ratings)}\\
&B = \mathrm{(Sum \, of \, top \, 31 \sim 50 \, ratings)}\\
&C = \mathrm{(Sum \, of \, top \, 51 \sim 100 \, ratings)}\\
&D = \mathrm{(Sum \, of \, top \, 101 \sim 150 \, ratings)}\\
&E = \mathrm{(Sum \, of \, top \, 151 \sim \, ratings)}\\ {} \\
&\mathrm{Rating} = ceil(\frac{A + 0.9\times B}{50} + 0.01 \times C + 0.001 \times D + 0.0001 \times E)
\end{align}
```

## Rating

The rating value is
```math
(Sum\,of\,top50\,song\,ratings)/50
```

### Song Rating

The calculation method for each song rating is as follows:

```math
\mathrm{Song\,Rating} = ceil(\mathrm{(Modified\,Accuracy)} \times \mathrm{(Fumen\,Measure)} \times \mathrm{(Modified\,Crown\,value)} \div 1000)
```

### Accuracy

Accuracy can be calculated as follows:

```math
\mathrm{Accuracy} = (\frac{\mathrm{Good \times 2 + Ok}}{\mathrm{Max\,Combo \times 2}} + min(0.05, Roll \times 0.0001)) \times 100
```

#### Modified Accuracy

The calculation method for the accuracy modifier is as follows:

```math
\mathrm{modify}(x) = 
\begin{cases}
e^{\frac{ln400001}{600000}10000x} - 1 \quad (10000x < 600000)\\
\frac{5}{3}(10000x-600000)+400000 \quad (600000 \leqq 10000x < 750000)\\
\frac{3}{2}(10000x-750000)+650000 \quad (750000 \leqq 10000x < 950000)\\
\frac{150000}{ln16}ln(\frac{10000x-950000}{10000}+1)+950000 \quad (950000 \leqq x)
\end{cases}
```

#### Modified Crown Value

The calculation method for the crown modifier is as follows:

```
Not cleared: 0.7
Cleared: 1
Full Combo: 1.1
Donderful Combo: 1.15
```
