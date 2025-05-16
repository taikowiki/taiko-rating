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
\mathrm{Accuracy} = 
\begin{cases}
(\frac{\mathrm{Good \times 2 + Ok}}{\mathrm{Max\,Combo \times 2}} + min(0.01, \frac{Roll}{\mathrm{Max\,Roll}})) \times 100\,\,\,\,(\mathrm{Max\,Roll} > 0) \\
(\frac{\mathrm{Good \times 2 + Ok}}{\mathrm{Max\,Combo \times 2}}) \times 101\,\,\,\,(\mathrm{Max\,Roll} = 0)
\end{cases}
```

#### Modified Accuracy

The calculation method for getting modified accuracy is as follows:

```math
\mathrm{modify}(x) = 
\begin{cases}
e^{\frac{ln400001}{60}x} - 1 \quad (0 \leqq x < 600000)\\
\frac{5}{3}(10000x-600000)+400000 \quad (60 \leqq x < 75)\\
\frac{3}{2}(10000x-750000)+650000 \quad (75 \leqq x < 95)\\
\frac{150000}{ln16}ln(x-94)+950000 \quad (95 \leqq x)
\end{cases}
```

### Max Roll
```math
\mathrm{Max\,Roll} = 
\begin{cases}
min(floor((\mathrm{World\,Best\,Record\,Roll\,Count}) * 0.85), 100)\,\,\,\,((\mathrm{World\,Best\,Record\,Roll\,Count}) > 5)\\
(\mathrm{World\,Best\,Record\,Roll\,Count})\,\,\,\,(O.W.)
\end{cases}
```

![graph](/docs/img/graph.png)

#### Modified Crown Value

The calculation method for the crown modifier is as follows:

```
Not cleared: 0.7
Cleared but the accuracy is under 85%: 0.7
Cleared: 1
Full Combo: 1.05
Donderful Combo: 1.1
```
