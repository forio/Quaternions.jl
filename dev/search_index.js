var documenterSearchIndex = {"docs":
[{"location":"examples/dual_quaternions/#Dual-quaternions","page":"Dual quaternions","title":"Dual quaternions","text":"","category":"section"},{"location":"examples/dual_quaternions/#Introduction","page":"Dual quaternions","title":"Introduction","text":"","category":"section"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"The dual quaternions are an example of \"biquaternions.\" They can be represented equivalently either as a dual number where both both the \"primal\" and \"tangent\" part are quaternions","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"d = q_0 + q_e epsilon = (s_0 + a_0 i + b_0 j + c_0 k) + (s_e + a_e i + b_e j + c_e k) epsilon","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"or as a quaternion where the scalar part and three imaginary parts are all dual numbers","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"d = s + ai + bj + ck = (s_0 + s_e epsilon) + (a_0 + a_e epsilon) i + (b_0 + b_e epsilon) j + (c_0 + c_e epsilon) k","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"Like unit quaternions can compactly representation rotations in 3D space, dual quaternions can compactly represent rigid transformations (rotation with translation).","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"Without any special glue code, we can construct a dual quaternion by composing ForwardDiff.Dual and Quaternion; this uses the second representation described above:","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"note: Note\nPreviously this package contained a specialized DualQuaternion type. This was removed in v0.6.0 because it offered nothing extra over composing ForwardDiff and Quaternions.","category":"page"},{"location":"examples/dual_quaternions/#Utility-functions","page":"Dual quaternions","title":"Utility functions","text":"","category":"section"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"First let's load the packages:","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"using Quaternions, ForwardDiff, Random","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"Then we'll create some utility types/functions:","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"const DualQuaternion{T} = Quaternion{ForwardDiff.Dual{Nothing,T,1}}\n\npurequat(p::AbstractVector) = quat(false, @views(p[begin:begin+2])...)\n\ndual(x::Real, v::Real) = ForwardDiff.Dual(x, v)\n\nfunction dualquat(_q0::Union{Real,Quaternion}, _qe::Union{Real,Quaternion})\n    q0 = quat(_q0)\n    qe = quat(_qe)\n    Quaternion(\n        dual(real(q0), real(qe)),\n        dual.(imag_part(q0), imag_part(qe))...,\n    )\nend\n\nfunction primal(d::DualQuaternion)\n    return Quaternion(\n        ForwardDiff.value(real(d)),\n        ForwardDiff.value.(imag_part(d))...,\n    )\nend\n\nfunction tangent(d::DualQuaternion)\n    return Quaternion(\n        ForwardDiff.partials(real(d), 1),\n        ForwardDiff.partials.(imag_part(d), 1)...,\n    )\nend\n\nfunction dualconj(d::DualQuaternion)\n    de = tangent(d)\n    return dualquat(conj(primal(d)), quat(-real(de), imag_part(de)...))\nend\n\nrotation_part(d::DualQuaternion) = primal(d)\n\ntranslation_part(d::DualQuaternion) = dualquat(true, conj(rotation_part(d)) * tangent(d))\n\n# first=true returns the translation performed before the rotation: R(p+t)\n# first=false returns the translation performed after the rotation: R(p)+t\nfunction translation(d::DualQuaternion; first::Bool=true)\n    v = first ? primal(d)' * tangent(d) : tangent(d) * primal(d)'\n    return collect(2 .* imag_part(v))\nend\n\nfunction transform(d::DualQuaternion, p::AbstractVector)\n    dp = dualquat(true, purequat(p))\n    dpnew = d * dp * dualconj(d)\n    pnew_parts = imag_part(tangent(dpnew))\n    pnew = similar(p, eltype(pnew_parts))\n    pnew .= pnew_parts\n    return pnew\nend\n\nfunction transformationmatrix(d::DualQuaternion)\n    R = rotationmatrix(rotation_part(d))\n    t = translation(d; first=false)\n    T = similar(R, 4, 4)\n    T[1:3, 1:3] .= R\n    T[1:3, 4] .= t\n    T[4, 1:3] .= 0\n    T[4, 4] = 1\n    return T\nend\n\nranddualquat(rng::AbstractRNG,T=Float64) = dualquat(rand(rng, Quaternion{T}), rand(rng, Quaternion{T}))\nranddualquat(T=Float64) = randdualquat(Random.GLOBAL_RNG,T)\nnothing  # hide","category":"page"},{"location":"examples/dual_quaternions/#Example:-transforming-a-point","page":"Dual quaternions","title":"Example: transforming a point","text":"","category":"section"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"Now we'll create a unit dual quaternion.","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"x = sign(randdualquat())","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"sign(q) == q / abs(q) both normalizes the primal part of the dual quaternion and makes the tangent part perpendicular to it.","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"abs(primal(x)) ≈ 1\nisapprox(real(primal(x)' * tangent(x)), 0; atol=1e-10)","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"Here's how we use dual quaternions to transform a point:","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"p = randn(3)","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"transform(x, p)","category":"page"},{"location":"examples/dual_quaternions/#Example:-homomorphism-from-unit-dual-quaternions-to-the-transformation-matrices","page":"Dual quaternions","title":"Example: homomorphism from unit dual quaternions to the transformation matrices","text":"","category":"section"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"Each unit dual quaternion can be mapped to an affine transformation matrix T. T can be used to transform a vector p like this:","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"T beginpmatrix p  1endpmatrix = beginpmatrix R  t  0^mathrmT  1endpmatrix beginpmatrix p  1endpmatrix = beginpmatrix Rp + t  1endpmatrix","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"where R is a rotation matrix, and t is a translation vector. Our helper function transformationmatrix maps from a unit dual quaternion to such an affine matrix.","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"y = sign(randdualquat())","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"X = transformationmatrix(x)\nY = transformationmatrix(y)\nXY = transformationmatrix(x*y)\nX*Y ≈ XY","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"We can check that our transformation using the unit dual quaternion gives the same result as transforming with an affine transformation matrix:","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"transform(x, p) ≈ (X * vcat(p, 1))[1:3]","category":"page"},{"location":"examples/dual_quaternions/#Example:-motion-planning","page":"Dual quaternions","title":"Example: motion planning","text":"","category":"section"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"For unit quaternions, spherical linear interpolation with slerp can be used to interpolate between two rotations with unit quaternions, which can be used to plan motion between two orientations. Similarly, we can interpolate between unit dual quaternions to plan motion between two rigid poses. Conveniently, we can do this using the exact same slerp implementation.","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"slerp(x, y, 0) ≈ x","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"slerp(x, y, 1) ≈ y","category":"page"},{"location":"examples/dual_quaternions/","page":"Dual quaternions","title":"Dual quaternions","text":"slerp(x, y, 0.3)","category":"page"},{"location":"#Quaternions.jl","page":"Home","title":"Quaternions.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"A Julia package implementing quaternions and octonions.","category":"page"},{"location":"","page":"Home","title":"Home","text":"note: Documentation\nThe documentation is still work in progress. For more information, see alsoREADME in the repository\nTests in the repositoryFeel free to open pull requests and improve this document!","category":"page"},{"location":"#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"pkg> add Quaternions","category":"page"},{"location":"#First-example","page":"Home","title":"First example","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"using Quaternions\nq = quat(0.0, 0.0, 0.0, 1.0)\nr = quat(0, 0, 1, 0)\nq*r\nq+r","category":"page"}]
}
