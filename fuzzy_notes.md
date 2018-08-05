
## Relative Speed

type: input

3 states: Over, Matched, Under
scale -kph to +kph

under for less than -x kph
under/matched up to 0 kph
matched only at exactly 0 kph
matched/over up to x kph
over for more than x kph

## Road Angle

type: input

3 states: Downhill, Flat, Uphill
scale -(angle in degrees) to +(angle in degree)

downhill for less than -x °
downhill/flat up to 0 °
flat only at exactly 0 °
flat/uphill up to x °
uphill for more than x °

## Car Action

type: output

5 states: Brake Hard, Brake Soft, Maintain, Accelerate Soft, Accelerate Hard
scale -kph to +kph

brake hard is less than -x kph
brake hard/brake soft up to -y kph
brake soft/maintain up to 0 kph
maintain only at exactly 0 kph
maintain/accelerate soft up to y kph
accelerate soft/accelerate hard up to x kph
accelerate hard is more than x kph

## 5 Rules:

RS = Relative Speed
RA = Road Angle
CA = Car Action

1. _IF_ (RS is Over _AND_ RA is Downhill)                                                                                _THEN_ CA is brake hard
2. _IF_ (RS is Over _AND_ RA is Flat)      _OR_ (RS is Matched _AND_ RA is Downhill)                                     _THEN_ CA is brake soft
3. _IF_ (RS is Over _AND_ RA is Uphill)    _OR_ (RS is Matched _AND_ RA is Flat) _OR_ (RS is Under _AND_ RA is Downhill) _THEN_ CA is maintain
4. _IF_ (RS is Matched _AND_ RA is Uphill) _OR_ (RS is Under _AND_ RA is Flat)                                           _THEN_ CA is accelerate soft
5. _IF_ (RS is Under _AND_ RA is Uphill)                                                                                 _THEN_ CA is accelerate hard

These can be interpreted as 9 seperate rules with 5 outcomes, splitting the ORs out:

1. _IF_ (RS is Over _AND_ RA is Downhill)    _THEN_ CA is brake hard
2. _IF_ (RS is Over _AND_ RA is Flat)        _THEN_ CA is brake soft
3. _IF_ (RS is Matched _AND_ RA is Downhill) _THEN_ CA is brake soft
4. _IF_ (RS is Over _AND_ RA is Uphill)      _THEN_ CA is maintain
5. _IF_ (RS is Matched _AND_ RA is Flat)     _THEN_ CA is maintain
6. _IF_ (RS is Under _AND_ RA is Downhill)   _THEN_ CA is maintain
7. _IF_ (RS is Matched _AND_ RA is Uphill)   _THEN_ CA is accelerate soft
8. _IF_ (RS is Under _AND_ RA is Flat)       _THEN_ CA is accelerate soft
9. _IF_ (RS is Under _AND_ RA is Uphill)     _THEN_ CA is accelerate hard

## Application

The 9 rules are used, applying a product t-norm (the simplest combination of two independent factors in conjunction).

Defuzzification is applied using the weighted average measure described in Fuzzy Logic by Timothy. J .Ross.

