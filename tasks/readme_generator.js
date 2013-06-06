// Generated by CoffeeScript 1.6.2
"use strict";
var fs;

fs = require('fs');

module.exports = function(grunt) {
  var append, back_to_top, generate_TOC, generate_banner, generate_footer, generate_release_history, generate_title, get_file_extension, get_latest_changelog, get_package_info, inform, is_valid_extention, make_anchor;

  inform = function(msg) {
    return grunt.log.oklns(msg + "...");
  };
  get_package_info = function(opts) {
    var desc, is_package_json_needed, name, package_info, pkg, title;

    is_package_json_needed = false;
    if ((opts.package_name != null) && opts.package_name.length > 0) {
      name = opts.package_name;
    } else {
      is_package_json_needed = true;
    }
    if ((opts.package_desc != null) && opts.package_desc.length > 0) {
      desc = opts.package_desc;
    } else {
      is_package_json_needed = true;
    }
    if (is_package_json_needed) {
      pkg = grunt.config.get(['pkg']);
      if (pkg == null) {
        grunt.fail.fatal("The package configuration is missing. Please add `pkg: grunt.file.readJSON('package.json')` to your grunt init in Gruntfile; or provide package_name and package_desc options");
      } else {
        if (name == null) {
          name = pkg.name;
        }
        if (desc == null) {
          desc = pkg.description;
        }
      }
    }
    if (opts.package_title != null) {
      title = opts.package_title;
    } else {
      title = name;
    }
    package_info = {
      name: name,
      description: desc,
      title: title
    };
    return package_info;
  };
  make_anchor = function(string) {
    var str;

    str = string.replace(/\s+/g, '-').toLowerCase();
    return str = "#" + str;
  };
  back_to_top = function(opts) {
    var pkg, result, str, travis;

    travis = opts.has_travis;
    pkg = get_package_info(opts);
    str = make_anchor(pkg.name);
    if (travis) {
      str += "-";
    }
    return result = "\[[Back To Top]\](" + str + ")";
  };
  get_file_extension = function(file) {
    var ext;

    ext = file.split('.').pop();
    return ext;
  };
  is_valid_extention = function(file) {
    var ext;

    ext = get_file_extension(file);
    if (ext.toLowerCase() === "md" || ext.toLowerCase() === "markdown" || ext.toLowerCase() === "mdown") {
      return true;
    } else {
      return false;
    }
  };
  get_latest_changelog = function(opts) {
    var changelog_folder, filename, files, latest, prefix, versions_found, _i, _len;

    if (opts.informative) {
      inform("Getting the latest changelog");
    }
    prefix = opts.changelog_version_prefix;
    changelog_folder = opts.changelog_folder;
    versions_found = [];
    files = fs.readdirSync(changelog_folder);
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      filename = files[_i];
      if (grunt.file.isFile(changelog_folder + "/" + filename) && is_valid_extention(filename)) {
        if (prefix.length > 0) {
          if (filename.substring(0, prefix.length) === prefix) {
            versions_found.push(filename);
          }
          console.log("there is a prefix " + prefix);
        } else {
          console.log("there isnt a prefix " + prefix);
          versions_found.push(filename);
        }
      }
    }
    if (versions_found.length > 0) {
      versions_found.sort();
      latest = versions_found[versions_found.length - 1];
      return latest;
    } else {
      grunt.fail.fatal("No changelogs are present. Please write a changelog file or fix prefixes.");
      return false;
    }
  };
  generate_banner = function(opts) {
    var banner_file, f, output, path;

    if (opts.informative) {
      inform("Generating banner");
    }
    path = opts.readme_folder;
    banner_file = opts.banner;
    output = opts.output;
    f = path + "/" + banner_file;
    if (!grunt.file.exists(f)) {
      return grunt.fail.fatal("Source file \"" + f + "\" not found.");
    } else {
      fs.appendFileSync(output, grunt.file.read(f));
      return fs.appendFileSync(output, "\n");
    }
  };
  generate_TOC = function(files, opts) {
    var changelog_insert_before, changelog_inserted, ex, file, i, link, output, release_title, title, toc_extra_links, _i, _len;

    if (opts.informative) {
      inform("Generating table of contents");
    }
    toc_extra_links = opts.toc_extra_links;
    changelog_insert_before = opts.changelog_insert_before;
    output = opts.output;
    fs.appendFileSync(output, "## Jump to Section\n\n");
    changelog_inserted = false;
    for (file in files) {
      title = files[file];
      if (file === changelog_insert_before && opts.generate_changelog) {
        changelog_inserted = true;
        release_title = make_anchor("Release History");
        fs.appendFileSync(output, "* [Release History](" + release_title + ")\n");
        link = make_anchor(title);
        fs.appendFileSync(output, "* [" + title + "](" + link + ")\n");
      } else {
        link = make_anchor(title);
        fs.appendFileSync(output, "* [" + title + "](" + link + ")\n");
      }
    }
    if (opts.generate_changelog && changelog_inserted === false) {
      release_title = make_anchor("Release History");
      fs.appendFileSync(output, "* [Release History](" + release_title + ")\n");
    }
    if (toc_extra_links.length > 0) {
      for (_i = 0, _len = toc_extra_links.length; _i < _len; _i++) {
        i = toc_extra_links[_i];
        ex = i;
        fs.appendFileSync(output, "* " + ex + "\n");
      }
    }
    return fs.appendFileSync(output, "\n");
  };
  generate_title = function(opts) {
    var desc, output, pkg, title, tra, travis, username;

    if (opts.informative) {
      inform("Writing package name and description");
    }
    output = opts.output;
    travis = opts.has_travis;
    username = opts.github_username;
    pkg = get_package_info(opts);
    title = pkg.name;
    desc = pkg.description;
    fs.appendFileSync(output, "# " + title + " ");
    if (travis) {
      if (opts.informative) {
        inform("Engineering travis button");
      }
      tra = "[![Build Status](https://secure.travis-ci.org/" + username + "/" + title + ".png?branch=master)](http://travis-ci.org/" + username + "/" + title + ")";
      fs.appendFileSync(output, "" + tra);
    }
    return fs.appendFileSync(output, "\n\n> " + desc + "\n\n");
  };
  append = function(opts, file, title) {
    var f, output, path, top, travis;

    path = opts.readme_folder;
    travis = opts.has_travis;
    output = opts.output;
    fs.appendFileSync(output, "## " + title + "\n");
    if (opts.table_of_contents) {
      top = back_to_top(opts);
      fs.appendFileSync(output, "" + top + "\n");
    }
    fs.appendFileSync(output, "\n");
    f = path + "/" + file;
    if (!grunt.file.exists(f)) {
      return grunt.fail.fatal("Source file \"" + f + "\" not found.");
    } else {
      fs.appendFileSync(output, grunt.file.read(f));
      return fs.appendFileSync(output, "\n\n");
    }
  };
  generate_release_history = function(opts) {
    var changelog_folder, latest, latest_extension, latest_file, latest_version, output, prefix, top, travis;

    if (opts.informative) {
      inform("Digging the past for release information");
    }
    prefix = opts.changelog_version_prefix;
    changelog_folder = opts.changelog_folder;
    travis = opts.has_travis;
    output = opts.output;
    fs.appendFileSync(output, "## Release History\n");
    if (opts.table_of_contents) {
      top = back_to_top(travis);
      fs.appendFileSync(output, "" + top + "\n");
    }
    fs.appendFileSync(output, "\nYou can find [all the changelogs here](/" + changelog_folder + ").\n\n");
    latest = get_latest_changelog(opts);
    latest_file = changelog_folder + "/" + latest;
    latest_extension = get_file_extension(latest);
    latest_version = latest.slice(prefix.length, -latest_extension.length - 1);
    fs.appendFileSync(output, "### Latest changelog is for [" + latest + "](/" + latest_file + "):\n\n");
    if (!grunt.file.exists(latest_file)) {
      return grunt.fail.fatal("Changelog file \"" + latest_file + "\" not found.");
    } else {
      fs.appendFileSync(output, grunt.file.read(latest_file));
      return fs.appendFileSync(output, "\n\n");
    }
  };
  generate_footer = function(opts) {
    var date, output, str;

    if (opts.informative) {
      inform("Adding the generation message, thank you");
    }
    output = opts.output;
    date = new Date();
    str = "\n\n--------\n<small>_This readme has been automatically generated by [readme generator](https://github.com/aponxi/grunt-readme-generator) on " + date + "._</small>";
    return fs.appendFileSync(output, str);
  };
  return grunt.registerMultiTask("readme_generator", "Generate Readme File", function() {
    var changelog_inserted, file, files, options, title;

    options = this.options({
      readme_folder: "readme",
      output: "README.md",
      table_of_contents: true,
      toc_extra_links: [],
      generate_changelog: false,
      changelog_folder: "changelogs",
      changelog_version_prefix: null,
      changelog_insert_before: null,
      banner: null,
      has_travis: true,
      github_username: "aponxi",
      travis_branch: "master",
      generate_footer: true,
      generate_title: true,
      package_title: null,
      package_name: null,
      package_desc: null,
      informative: true,
      h1: "#",
      h2: "##",
      back_to_top_custom: null
    });
    grunt.file.write(options.output, "");
    files = this.data.order;
    if (options.banner != null) {
      generate_banner(options);
    }
    if (options.generate_title) {
      generate_title(options);
    }
    if (options.table_of_contents) {
      generate_TOC(files, options);
    }
    changelog_inserted = false;
    for (file in files) {
      title = files[file];
      if (file === options.changelog_insert_before && options.generate_changelog) {
        generate_release_history(options);
        changelog_inserted = true;
        append(options, file, title);
      } else {
        append(options, file, title);
      }
    }
    if (options.generate_changelog && changelog_inserted === false) {
      generate_release_history(options);
    }
    if (options.generate_footer) {
      generate_footer(options);
    }
    grunt.log.writeln("Your readme file \"" + options.output + "\" is ready!");
    return grunt.log.ok();
  });
};
