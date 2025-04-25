import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Track, insertTrackSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AlertCircle, Edit, Trash2, Music, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Extended schema with file validation
const uploadTrackSchema = insertTrackSchema.extend({
  audioFile: z.instanceof(FileList).refine(files => files.length === 1, {
    message: "Audio file is required",
  }),
});

type UploadTrackFormValues = z.infer<typeof uploadTrackSchema>;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("tracks");
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: tracks, isLoading: isLoadingTracks } = useQuery<Track[]>({
    queryKey: ['/api/tracks'],
  });
  
  const { data: genres, isLoading: isLoadingGenres } = useQuery<{id: number, name: string}[]>({
    queryKey: ['/api/genres'],
  });
  
  const { data: moods, isLoading: isLoadingMoods } = useQuery<{id: number, name: string}[]>({
    queryKey: ['/api/moods'],
  });
  
  // Form for uploading new track
  const form = useForm<UploadTrackFormValues>({
    resolver: zodResolver(uploadTrackSchema),
    defaultValues: {
      title: "",
      genre: "",
      mood: "",
      duration: "",
      bpm: undefined,
      key: "",
      featured: false,
    },
  });
  
  // Upload track mutation
  const uploadTrackMutation = useMutation({
    mutationFn: async (values: UploadTrackFormValues) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("genre", values.genre);
      formData.append("mood", values.mood);
      formData.append("duration", values.duration);
      if (values.bpm) formData.append("bpm", values.bpm.toString());
      if (values.key) formData.append("key", values.key);
      formData.append("featured", values.featured ? "true" : "false");
      formData.append("audioFile", values.audioFile[0]);
      
      const res = await fetch("/api/tracks/create", {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa("admin:admin123"),
        },
        body: formData,
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to upload track");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tracks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tracks/featured'] });
      form.reset();
      toast({
        title: "Track uploaded successfully",
        description: "Your track has been added to the library",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete track mutation
  const deleteTrackMutation = useMutation({
    mutationFn: async (trackId: number) => {
      const res = await fetch(`/api/tracks/delete/${trackId}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Basic " + btoa("admin:admin123"),
        },
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete track");
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tracks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tracks/featured'] });
      setIsDeleteDialogOpen(false);
      setSelectedTrack(null);
      toast({
        title: "Track deleted",
        description: "The track has been removed from the library",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  const onSubmit = (values: UploadTrackFormValues) => {
    uploadTrackMutation.mutate(values);
  };
  
  // Delete track handler
  const handleDeleteTrack = () => {
    if (selectedTrack) {
      deleteTrackMutation.mutate(selectedTrack.id);
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="tracks">Manage Tracks</TabsTrigger>
          <TabsTrigger value="upload">Upload New Track</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracks">
          <Card>
            <CardHeader>
              <CardTitle>Tracks Library</CardTitle>
              <CardDescription>
                Manage your music tracks. You can edit or delete existing tracks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTracks ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : tracks && tracks.length > 0 ? (
                <Table>
                  <TableCaption>List of all tracks in your library</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>Mood</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tracks.map(track => (
                      <TableRow key={track.id}>
                        <TableCell className="font-medium">{track.title}</TableCell>
                        <TableCell>{track.genre}</TableCell>
                        <TableCell>{track.mood}</TableCell>
                        <TableCell>{track.duration}</TableCell>
                        <TableCell>
                          {track.featured ? "Yes" : "No"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => {
                                setSelectedTrack(track);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No tracks in your library</h3>
                  <p className="text-muted-foreground mt-2 mb-6">
                    Start by uploading your first track using the Upload tab.
                  </p>
                  <Button onClick={() => setActiveTab("upload")}>
                    Upload a Track
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Track</CardTitle>
              <CardDescription>
                Add a new track to your music library. Provide all the necessary details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Track Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter track title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genre</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select genre" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {genres?.map(genre => (
                                <SelectItem key={genre.id} value={genre.name}>
                                  {genre.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mood</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select mood" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {moods?.map(mood => (
                                <SelectItem key={mood.id} value={mood.name}>
                                  {mood.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 3:42" {...field} />
                          </FormControl>
                          <FormDescription>Format: minutes:seconds</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bpm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BPM (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 120" 
                              {...field}
                              value={field.value || ''} // Fix for TypeScript error
                              onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. C Minor" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured Track</FormLabel>
                          <FormDescription>
                            Display this track in the featured section on the homepage
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="audioFile"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Audio File (MP3)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="audio/mpeg"
                            {...field}
                            onChange={e => onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum file size: 10MB
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={uploadTrackMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    {uploadTrackMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Upload Track
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Are you sure you want to delete "{selectedTrack?.title}"? This action cannot be undone.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTrack}
              disabled={deleteTrackMutation.isPending}
            >
              {deleteTrackMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Track"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
