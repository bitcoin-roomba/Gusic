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
                            if(!target.imageset)
                            {
                                string art = locateAlbumArt(Path.GetDirectoryName(filePath));
                                if (art != null)
                                {
                                    target.imagesrc = art;
                                    target.imageset = true;
                                }
                                /*if (File.Exists(Path.Combine(Path.GetDirectoryName(filePath), "cover.jpg")))
                                {
                                    target.imagesrc = Path.Combine(Path.GetDirectoryName(filePath), "cover.jpg");
                                    target.imageset = true;
                                } else {
                                    List<String> images = new List<String>(Directory.GetFiles(Path.GetDirectoryName(filePath), "*.jpg"));
                                    images.AddRange(Directory.GetFiles(Path.GetDirectoryName(filePath), "*.png"));
                                    if (images.Count != 0)
                                    {
                                        target.imagesrc = images[0];
                                        target.imageset = true;
                                    }
                                }*/
                            }
                        }
                    }
                    catch (Exception e) {
                        Console.WriteLine(e.Message);
                    }
                }
            }

            foreach (Album x in albums)
            {
                x.SortTracks();
                Console.WriteLine(x.year + " - " + x.title + " - " + x.artist + " - " + x.imagesrc);
                foreach (Track y in x.tracks)
                {
                    Console.WriteLine(y.tracknum + " - " + y.name + " - " + y.path);
                }
            }
            LibraryJSGenerator generator = new LibraryJSGenerator(albums, entryFolder);
            List<String> lines = generator.GenerateLines();
            using (StreamWriter file = new StreamWriter(Path.Combine(entryFolder, "js\\albums.js")))
            {
                foreach (String x in lines)
                {
                    file.WriteLine(x);
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

        static string locateAlbumArt(string dir)
        {
            if (File.Exists(Path.Combine(dir, "cover.jpg")))
            {
                return Path.Combine(dir, "cover.jpg");
                
            }
            if (File.Exists(Path.Combine(dir, "cover.png")))
            {
                return Path.Combine(dir, "cover.png");
            }
            string name = (new DirectoryInfo(dir)).Name;
            if (File.Exists(Path.Combine(dir, name + ".jpg")))
            {
                return Path.Combine(dir, name + ".jpg");

            }
            if (File.Exists(Path.Combine(dir, name + ".png")))
            {
                return Path.Combine(dir, name + ".png");
            }
            List<String> images = new List<String>(Directory.GetFiles(dir, "*.jpg"));
            images.AddRange(Directory.GetFiles(dir, "*.png"));
            if (images.Count != 0)
            {
                return images[0];
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

        public void SortTracks()
        {
            tracks.Sort();
        }
    }

    class Track : IComparable
    {
        public string name;
        public string path;
        public int tracknum;

        public Track(string name, string path, int tracknum) {
            this.name = name;
            this.path = path;
            this.tracknum = tracknum;
        }

        public int CompareTo(Object obj)
        {
            if (!(obj is Track)) {
                throw new ArgumentException("Wrong type");
            }
            if (obj == null)
            {
                throw new NullReferenceException("null track");
            }
            Track other = obj as Track;
            return this.tracknum - other.tracknum;
        }
    }

    class LibraryJSGenerator
    {
        List<Album> albums;
        string entryFolder;

        public LibraryJSGenerator(List<Album> albums, string entryFolder)
        {
            this.albums = albums;
            this.entryFolder = entryFolder;
        }

        public List<String> GenerateLines() {
            List<String> lines = new List<string>();
            lines.Add("var albums = [");
            //process albums here
            int i = 1;
            foreach(Album x in albums)
            {
                lines.Add("{");
                lines.Add("\"album\": \"" + x.title + "\",");
                lines.Add("\"band\": \"" + x.artist + "\",");
                lines.Add("\"year\": \"" + x.year + "\",");
                lines.Add("\"id\": " + i + ",");
                lines.Add("\"src\": \"" + Path.GetRelativePath(entryFolder, x.imagesrc).Replace("\\", "/") + "\",");
                lines.Add("\"tracks\": [");
                foreach(Track y in x.tracks)
                {
                    lines.Add("{");
                    lines.Add("\"name\": \"" + y.name + "\",");
                    lines.Add("\"src\": \"" + Path.GetRelativePath(entryFolder, y.path).Replace("\\", "/") + "\",");
                    lines.Add("},");
                }
                lines.Add("]");
                lines.Add("},");
                i++;
            }
            //end album processing
            lines.Add("];");
            return lines;
        }
    }
}
