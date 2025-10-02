import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Obj = {
  id: string;
  name: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string | null;
  metadata: any | null;
};

const BUCKET = "gallery";

const GalleryAdmin = () => {
  const [files, setFiles] = useState<Obj[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [prefix, setPrefix] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const loadFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(prefix || undefined, { limit: 100, offset: 0, sortBy: { column: "updated_at", order: "desc" } });
    if (!error && data) {
      // Only keep actual files; folders typically have null metadata/id
      const onlyFiles = (data as any[]).filter((f) => f && f.id && f.metadata);
      setFiles(onlyFiles as Obj[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    setUploading(true);
    const date = new Date();
    const folder = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`;
    const tasks: Promise<any>[] = [];
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const path = `${folder}/${crypto.randomUUID()}-${file.name}`;
      tasks.push(supabase.storage.from(BUCKET).upload(path, file, { upsert: false }));
    }
    const results = await Promise.all(tasks);
    setUploading(false);
    const firstError = results.find((r) => r?.error)?.error as { message: string } | undefined;
    if (firstError) {
      // eslint-disable-next-line no-alert
      alert(firstError.message);
    }
    setPrefix(folder);
    await loadFiles();
    // Reset input value so same file can be selected again
    e.target.value = "";
  };

  const remove = async (path: string) => {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
      return;
    }
    await loadFiles();
  };

  const items = useMemo(() => {
    return files.map((f) => {
      const fullPath = prefix ? `${prefix}/${f.name}` : f.name;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(fullPath);
      return { ...f, path: fullPath, url: data.publicUrl } as Obj & { path: string; url: string };
    });
  }, [files, prefix]);

  return (
    <div className="pt-16 p-6">
      <div className="container mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl font-baloo font-bold">Gallery</h1>
          <div className="flex items-center gap-2">
            <Input type="file" accept="image/*" multiple onChange={upload} disabled={uploading} />
            <Button variant="outline" onClick={loadFiles} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            {items.length === 0 ? (
              <div className="text-sm text-muted-foreground">No images yet. Upload to get started.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map((it) => (
                  <div key={it.path} className="border rounded-lg overflow-hidden group">
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={it.url}
                        alt={it.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                        onError={(ev) => {
                          // Fallback to a simple placeholder if the public URL 404s (policy or path issues)
                          (ev.currentTarget as HTMLImageElement).src = 
                            'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-family="Arial" font-size="14">Image not available</text></svg>');
                        }}
                      />
                    </div>
                    <div className="p-2 text-xs flex items-center justify-between gap-2">
                      <span className="truncate" title={it.name}>{it.name}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard?.writeText(it.url);
                          }}
                        >
                          Copy URL
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(it.path)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GalleryAdmin;
