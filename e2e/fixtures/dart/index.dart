// @OctoLinkerResolve(https://api.dart.dev/stable/dart-async/dart-async-library.html)
import 'dart:async';

// @OctoLinkerResolve(https://pub.dev/packages/source_maps)
import 'package:source_maps/source_maps.dart';

// @OctoLinkerResolve(https://pub.dev/packages/path)
import 'package:path/path.dart' as p;

// @OctoLinkerResolve(<root>/dart/foo.dart)
import 'foo.dart';

// @OctoLinkerResolve(<root>/dart/relative/foo.dart)
import 'relative/foo.dart';

// @OctoLinkerResolve(<root>/dart/foo.dart)
import 'foo.dart'
    // @OctoLinkerResolve(<root>/dart/foo.dart)
    if (dart.library.io) 'foo.dart'
    // @OctoLinkerResolve(<root>/dart/relative/foo.dart)
    if (dart.library.js) 'relative/foo.dart';

// @OctoLinkerResolve(<root>/dart/foo.dart)
export 'foo.dart';

// @OctoLinkerResolve(<root>/dart/foo.dart)
export 'foo.dart'
    // @OctoLinkerResolve(<root>/dart/foo.dart)
    if (dart.library.io) 'foo.dart'
    // @OctoLinkerResolve(<root>/dart/foo bar/test.dart)
    if (dart.library.js) 'relative/foo.dart';

// @OctoLinkerResolve(<root>/dart/foo.dart)
part 'foo.dart';
