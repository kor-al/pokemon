library(ggplot2)
library(dplyr)
library(rjson)
library(treemap)
library(d3treeR)
library(tidyr)
library(igraph)
library(circlize)
library(chorddiag) #remotes::install_github("mattflor/chorddiag")

data <- read.csv("Onyx Data DataDNA Dataset Challenge July 2022 - Pokemon Dataset.csv")
print(data)

for (i in 1:nrow(data))
{
  data$speed_rank[i] = sum(data$speed < data$speed[i])
}

data$url_img <- paste0("https://serebii.net/pokemon/art/",sprintf("%03d", data$pokedex_number),".png")
data$url_img_sm <- paste0("https://www.serebii.net/art/th/",data$pokedex_number,".png")

data$weakness<-apply(data[columns.against], 1, function(x) {
  maxVal <- max(x)
  cols <- columns.against[x == maxVal]
  #print(x[cols])
  #print(cols)
  return(cols)
})

data$resistance<-apply(data[columns.against], 1, function(x) {
  minVal <- min(x)
  cols <- columns.against[x == minVal]
  #print(x[cols])
  #print(cols)
  return(cols)
})

names(data) <- replace(names(data), names(data) == "against_fight", "against_fighting")
#data$type1 <- replace(data$type1 , data$type1  == "fight", "fighting")

data.json <- toJSON(unname(split(data, 1:nrow(data))))
write(data.json, "Onyx Data DataDNA Dataset Challenge July 2022 - Pokemon Dataset.json")



#SCRAPE

for(i in seq_along(data$pokedex_number)[630:801]){
  url = data$url_img[i]
  destination = paste0("./pokemons_pokedex/",i,".png")
  download.file(url, destination, mode="wb")
}

for(i in seq_along(data$pokedex_number)[329:801]){
  url = data$url_img_sm[i]
  destination = paste0("./pokemons_small/",data$name[i],".png")
  download.file(url, destination, mode="wb")
}

# ANALYZE


stats <- c("defense", "attack", "hp")

data1 <- data[, append(stats, "type1")] %>% rename(type = type1)
data2 <- data[, append(stats, "type2")] %>% rename(type = type2)
data_type <- data1  %>% bind_rows(data2)

data1 <- data
data2 <- data %>% rename(type2 = type1, type1 = type2)
data_reverse <- data1  %>% bind_rows(data2)

#replace "" in type 1 with type1 value
data.completed <- data_reverse #or data
data.completed$type2 <- ifelse(data.completed$type2=="", data.completed$type1, data.completed$type2)
data.flow <-count(data.completed, type1, type2)
#if data was doubled:
data.flow$n <- ifelse(data.flow$type1==data.flow$type2, data.flow$n/2, data.flow$n)

data.flow.json <- toJSON(unname(split(data.flow, 1:nrow(data.flow))))
write(data.flow.json, "Pokemon Dataset - Types Counts.json")



columns.against <- names(data)[2:19]
hist(rowSums(data[ columns.against ]))



ggplot(data=data, aes(y=type1)) + geom_bar()

ggplot(data=data, aes(y=generation)) + geom_bar()
ggplot(data=data, aes(y=base_happiness)) + geom_bar()

count(data, data$classfication)# %>% arrange(desc(n))

count(data, type1)
count(data, type2)
sum(data$type2 == "")

#ggplot(data = data, mapping = aes(x = type2, y = type1,
#                                       fill = attack)) +
#  geom_tile() +
#  xlab(label = "Type2")

data %>% count(type1, type2, sort = TRUE) %>%
  ggplot(mapping = aes(x = type2, y = type1, fill = n))+
  geom_tile()

ggplot(data=data, aes(y=base_egg_steps, x=strtoi(data$capture_rate), color=base_happiness))+geom_point(size=2, shape=23)

capture_share = strtoi(data$capture_rate)/255
#the higher the easier

ggplot(data_type, aes(x = type, y = hp)) + geom_violin()
ggplot(data, aes(x = type1, y = defense)) + geom_violin()
ggplot(data, aes(x = type1, y = capture_share)) + geom_violin()
ggplot(data, aes(x = type1, y = defense)) + geom_violin()
ggplot(data, aes(x = type1, y = rowSums(data[ columns.against ]))) + geom_violin()

ggplot(data, aes(x = type1, y = height_m)) + geom_violin()

ggplot(data=data, aes(x=height_m)) + geom_histogram()
ggplot(data=data, aes(x=weight_kg)) + geom_histogram()
ggplot(data=data, aes(x=hp)) + geom_histogram()

ggplot(data=data) + geom_histogram(aes(x=speed), fill="blue", alpha = 0.5) +
  geom_histogram(aes(x=defense), fill="green", alpha = 0.5)+
  geom_histogram(aes(x=attack), fill="red", alpha = 0.5)

ggplot(data=data) + geom_histogram(aes(x=defense), fill="blue", alpha = 0.5) +
  geom_histogram(aes(x=sp_defense), fill="green", alpha = 0.5)

ggplot(data=data) + geom_histogram(aes(x=attack), fill="blue", alpha = 0.5) +
  geom_histogram(aes(x=sp_attack), fill="green", alpha = 0.5)

ggplot(data=data) + geom_histogram(aes(x=attack), fill="blue", alpha = 0.5) +
  geom_histogram(aes(x=speed), fill="red", alpha = 0.5)


ggplot(data=data) + geom_histogram(aes(x=strtoi(data$capture_rate)), fill="blue",
                                   alpha = 0.5)
ggplot(data=data) + geom_histogram(aes(x=data$base_happiness), fill="blue",
                                   alpha = 0.5)
ggplot(data=data) + geom_histogram(aes(x=data$base_egg_steps), fill="blue",
                                   alpha = 0.5)
ggplot(data=data) + geom_histogram(aes(x=data$experience_growth), fill="blue",
                                   alpha = 0.5)


ggplot(data=data, aes(y=base_total, x=generation))+geom_point(size=2, shape=23)


ggplot(data=data, aes(y=base_total, x=generation))+geom_point(size=2, shape=23)

ggplot(data=data, aes(y=rowSums(data[ columns.against ]), x=generation))+geom_point(size=2, shape=23)

ggplot(data=data, aes(y=rowSums(data[ columns.against ]), x=base_total, color=generation))+geom_point(size=2, shape=23)


ggplot(data=data, aes(y=weight_kg, x=height_m, color=base_total))+geom_point( shape=23)+
  scale_x_continuous(trans='log10') +
  scale_y_continuous(trans='log10')



data %>% filter(type1 == 'water') %>%
  ggplot(aes(y=attack, x=defense, size=hp, color=speed))+geom_point(alpha=0.3)


# basic treemap
p <- treemap(data,
             index=c("classfication","name"),
             vSize="size_mkg",
             type="index",
             palette = "Set2",
             align.labels=list(
               c("center", "center"), 
               c("right", "bottom")
             )  
)            

# make it interactive ("rootname" becomes the title of the plot):
inter <- d3tree2( p ,  rootname = "General" )


#network

ndata <-data %>%select(all_of(columns.against), type1)
names(ndata) <- sub("against_*", "", names(ndata))

links <- ndata %>% gather("against", "weight", -type1) %>% 
  group_by(against, type1)

slinks <- links %>% summarise(across(everything(), list(sum = sum)))

nodes <- data.frame(
  name=unique(slinks$type1)
)

network <- graph_from_data_frame(d=slinks, directed=F) 
plot(network,edge.width=log10(links$value_sum))

chordDiagram(slinks, self.link = 1,direction.type = c("diffHeight", "arrows"), link.arr.type = "big.arrow", directional = 1)
circos.clear()

mygraph <- graph.data.frame(slinks)
adjacencyData <-get.adjacency(mygraph, sparse = FALSE, attr='weight_sum')
#chordDiagram(adjacencyData, transparency = 0.5)
chorddiag(adjacencyData, showTicks = F, groupnameFontsize = 14, groupnamePadding = 10, margin = 90)


##### CLUSTERING
#data.pca <- data[, c(2:29, 32,34:41)]
data.pca <- data[, c(2:23,26:29, 32,34:36,39,40,41)] 
colSums(is.na(data.pca))

data.pca$weight_kg <- data.pca$weight_kg%>% replace_na(0)
data.pca$height_m <-data.pca$height_m %>% replace_na(0)
data.pca$percentage_male <-data.pca$percentage_male %>% replace_na(0)

pca <- prcomp(data.pca, center = TRUE,scale. = TRUE)
summary(pca)

library(ggbiplot)

ggbiplot(pca)

library(FactoMineR)
pca <-  PCA(data.pca, scale.unit=TRUE, ncp=5, graph=T)

#KMEANS
library(factoextra)

df <- data[, c(2:23,26:29, 32,34:36,39,40,41)] 

# Omitting any NA values
df <- na.omit(df)

# Scaling dataset
df <- scale(df)


km <- kmeans(df, centers = 4, nstart = 25)

# Visualize the clusters
fviz_cluster(km, data = df)



km <- kmeans(df, centers = 5, nstart = 25)

# Visualize the clusters
fviz_cluster(km, data = df)
