﻿using System;
using System.Collections.Generic;
using System.IO;

namespace GusicLibraryBuilder
{
    class Program
    {
        static void Main(string[] args) {
            string entryFolder;
            if (args.Length == 0) {
                Console.WriteLine("No Argument, using launch directory");
                entryFolder = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                return;
            }
            else {
                entryFolder = args[0];
                try {
                    entryFolder = Path.GetDirectoryName(entryFolder);
                }
                catch (ArgumentException) {
                    Console.WriteLine("Invalid Path, exiting");
                    return;
                }
            }

            List<Album> albums = new List<Album>();
            List<String> supportedTypes = new List<string> { ".mp3", ".flac", ".m4a" };

            List<String> dirs = new List<string>(Directory.GetDirectories(entryFolder, "*", SearchOption.AllDirectories));
            dirs.Add(entryFolder);
            foreach (String dir in dirs) {
                String[] files = Directory.GetFiles(dir);
                foreach (String filePath in files) {
                    try {
                        if (supportedTypes.Contains(Path.GetExtension(filePath).ToLower())) {
                            TagLib.File current = null;
                            try {
                                current = TagLib.File.Create(filePath);
                            }
                            catch (Exception e) {
                                Console.WriteLine(e.Message);
                                continue;
                            }
                            Album target = GetAlbum(albums, current.Tag.Album, current.Tag.FirstPerformer, (int)current.Tag.Year);
                            if (target == null) {
                                target = new Album(current.Tag.Album, current.Tag.FirstPerformer, (int)current.Tag.Year);
                                albums.Add(target);
                            }
                            target.tracks.Add(new Track(current.Tag.Title, filePath, (int)current.Tag.Track));
                        }
                    }
                    catch (Exception e) {
                        Console.WriteLine(e.Message);
                    }
                }
            }
        }

        static Album GetAlbum (List<Album> albums, string title, string artist, int year) {
            foreach (Album x in albums) {
                if (x.title == title && x.artist == artist && x.year == year) {
                    return x;
                }
            }
            return null;
        }
    }

    class Album
    {
        public string title;
        public string artist;
        public int year;
        public string imagesrc;
        public List<Track> tracks;
        public bool imageset;  
        
        public Album(string title, string artist, int year) {
            this.title = title;
            this.artist = artist;
            this.year = year;
            tracks = new List<Track>();
            imageset = false;
        }
    }

    class Track
    {
        public string name;
        public string path;
        public int tracknum;

        public Track(string name, string path, int tracknum) {
            this.name = name;
            this.path = path;
            this.tracknum = tracknum;
        }
    }
}