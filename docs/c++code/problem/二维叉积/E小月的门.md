```c++
#include <bits/stdc++.h>
using namespace std;
#define int long long
using ll = long long;
struct P{
    int x,y;
};
int cross(P a,P b,P c){
    int k=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
    if(k>0)return 1;
    if(k<0)return -1;
    return 0;
}
bool check(P u,P v,P a,P b){
    int c1=cross(u,v,a);
    int c2=cross(u,v,b);
    int c3=cross(a,b,u);
    int c4=cross(a,b,v);
    return c1*c2<0&&c3*c4<0;
}
void fc() {
    int n;
    std::cin>>n;
    P u,v;
    std::cin>>u.x>>u.y>>v.x>>v.y;
    
    int cnt=0;
    for(int i=0;i<n;i++){
        P a,b;
        std::cin>>a.x>>a.y>>b.x>>b.y;
        
        if(!check(u,v,a,b))continue;
        int x=cross(u,v,a);
        if(x<0)cnt++;
        else cnt--;
    }
    std::cout<<cnt<<"\n";
}

signed main() {
	ios::sync_with_stdio(false);
	cin.tie(nullptr);
	int t = 1;
	//std::cin>>t;
	while (t--) fc();
	return 0;
}
```