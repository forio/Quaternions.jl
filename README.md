# Quaternions.jl
A Julia implementation of quaternions.

[![Stable](https://img.shields.io/badge/docs-stable-blue.svg)](https://JuliaGeometry.github.io/Quaternions.jl/stable)
[![Dev](https://img.shields.io/badge/docs-dev-blue.svg)](https://JuliaGeometry.github.io/Quaternions.jl/dev)
[![Build Status](https://github.com/JuliaGeometry/Quaternions.jl/workflows/CI/badge.svg)](https://github.com/JuliaGeometry/Quaternions.jl/actions?query=workflow%3ACI+branch%3Amaster)
[![codecov](https://codecov.io/gh/JuliaGeometry/Quaternions.jl/branch/master/graph/badge.svg?token=dJBiR91dCD)](https://codecov.io/gh/JuliaGeometry/Quaternions.jl)
[![Aqua QA](https://raw.githubusercontent.com/JuliaTesting/Aqua.jl/master/badge.svg)](https://github.com/JuliaTesting/Aqua.jl)

[Quaternions](http://en.wikipedia.org/wiki/Quaternion) are best known for their suitability
as representations of 3D rotational orientation. They can also be viewed as an extension of complex numbers.

Implemented functions are:

    +-*/^
    real
    imag_part  (tuple)
    conj
    abs
    abs2
    normalize
    normalizea  (return normalized quaternion and absolute value as a pair)
    angleaxis  (taken as an orientation, return the angle and axis (3 vector) as a tuple)
    angle
    axis
    sqrt
    exp
    exp2
    exp10
    expm1
    log2
    log10
    log1p
    sin
    cos
    tan
    asin
    acos
    atan
    sinh
    cosh
    tanh
    asinh
    acosh
    atanh
    csc
    sec
    cot
    acsc
    asec
    acot
    csch
    sech
    coth
    acsch
    asech
    acoth
    sinpi
    cospi
    sincos
    sincospi
    slerp
    rand
    randn
