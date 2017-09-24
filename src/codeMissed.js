{this.props.navigation.state.params.data.imagenExtra ? (<View>
  <Text style={styles.masInformacionStyle}>
    ¡Conócenos más!
  </Text>
  <FlatList
    horizontal={true}
    data={this.props.navigation.state.params.data.imagenExtra}
    renderItem={({item}) =>
      <View style={{alignItems:"center", marginBottom: 10}}>
        <View style={{backgroundColor:"rgba(255,255,255,0.3)", width: 120, height: 160, marginLeft: 5, marginRight: 5, borderRadius: 12}}>
          <TouchableOpacity
            style={{flex: 1, alignItems: "center", justifyContent: "center"}}
            onPress={null}
            >
            {item.imagenUrl !== null ? <CachedImage style={styles.imageBusinessStyle} source={{uri: item.imagenUrl}}/> : null }
          </TouchableOpacity>
        </View>

      </View>
    }
  />
</View>) : null}
